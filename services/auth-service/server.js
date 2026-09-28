const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const authRouter = require('./routes/auth')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const hpp = require('hpp')
// const xss = require('xss-clean')
const helmet = require('helmet')
// const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')

const app = express();


if (process.env.NODE_ENV !== 'production') {
    dotenv.config({path: './.env'})
}


app.use(helmet())

// app.use(mongoSanitize())


// app.use(xss())

app.use(hpp())


app.use(cookieParser())

app.use(express.json({limit: '10kb'}))
app.use(morgan('dev'))
app.use(cors())


app.use('/api/v1/auth', authRouter)


app.get('/api/v1/auth/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'api health endpoint'
    })
})


const port = process.env.AUTH_PORT || 5000;
const DB = process.env.DATABASE

mongoose.connect(DB).then(() => app.listen(port, () => {console.log('listening on port', port)})).catch(err => console.error(err))
