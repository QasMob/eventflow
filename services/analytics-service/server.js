const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express();
const hpp = require('hpp')
// const xss = require('xss-clean')
const helmet = require('helmet')
// const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const rabbitmq = require('./utils/rabbitmq')
const redisClient = require('./utils/redis')
const analyticsRouter = require('./routes/topEvent')


if (process.env.NODE_ENV !== 'production') {
    dotenv.config({path: './.env'})
}


// helmet for security http headers
app.use(helmet())

// data sanitzation
// express-mongo-sanitize for protect against no-sql query injection
// xss-clean for protect against xss attacks


app.use(cookieParser())

app.use(express.json({limit: '10kb'}))


// app.use(mongoSanitize())


// cleans req.body, req.query, res.params
// app.use(xss())

app.use(hpp())

app.use(morgan('dev'))
app.use(cors())

const limiterOptions = {
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Your ip has done enough requests in the time window please try again in an hour'
}

const limiter = rateLimit(limiterOptions)

app.use('/api', limiter)

app.use('/api/v1/analytics', analyticsRouter)


app.get('/api/v1/analytics/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'api health endpoint'
    })
})


app.use((req, res, next) =>  {
    res.status(404).json({
        status: 'fail',
        message: 'Route not found'
    })
})


const port = process.env.PORT || 5002;
const DB = process.env.DATABASE


mongoose.connect(DB).then(async () => { await rabbitmq.connect(); await rabbitmq.consumeEvent(); app.listen(port, () => {console.log('listening on port', port)})} ).catch(err => console.error(err))
