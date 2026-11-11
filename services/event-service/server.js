
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const rabbitmq = require('./utils/rabbitmq')
const app = require('./app')

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: './.env' })
}

const port = process.env.EVENT_PORT || 5001
const DB = process.env.DATABASE

mongoose.connect(DB)
    .then(async () => {
        await rabbitmq.connect()

        app.listen(port, () => {
            console.log('listening on port', port)
        })
    })
    .catch(err => console.error(err))
