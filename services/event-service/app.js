
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const projectRouter = require('./routes/project')
const eventRouter = require('./routes/event')
const hpp = require('hpp')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')

const app = express()

app.use(helmet())
app.use(cookieParser())
app.use(express.json({ limit: '10kb' }))
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

app.use('/api/v1/projects', projectRouter)
app.use('/api/v1/events', eventRouter)

app.get('/api/v1/events/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'api health endpoint'
    })
})

app.use((req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: 'Route not found'
    })
})

module.exports = app
