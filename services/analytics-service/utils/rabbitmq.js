const amqp = require('amqplib')
const Event = require('../models/Event')

let channel;

async function connect(retries = 5, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL)
            channel = await connection.createChannel()
            await channel.assertQueue('events', { durable: true })
            console.log('Connected to RabbitMQ')
            return
        } catch (err) {
            console.log(`RabbitMQ not ready, retrying in ${delay/1000}s... (${i+1}/${retries})`)
            await new Promise(res => setTimeout(res, delay))
        }
    }
    throw new Error('Could not connect to RabbitMQ after retries')
}

function consumeEvent(){
    channel.consume('events', async (msg) => {
        const event = JSON.parse(msg.content.toString())

        const newEvent = await Event.create(event)

        // rabbitmq wont remove a message from queue untill acknowledged

        channel.ack(msg)

    })
}

exports.connect = connect
exports.consumeEvent = consumeEvent
