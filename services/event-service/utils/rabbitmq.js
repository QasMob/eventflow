// handles connection
// expose two things:
// connect function that connects to RabbitMQ and creates an event queue
// publishEvent function that takes an event object and publishes it to the queue

const amqp = require('amqplib')

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

 function publishEvent(message){

    channel.sendToQueue('events', Buffer.from(JSON.stringify(message)))

    // RabbitMQ sends raw bytes, so you convert obj to a JSON string, than to a Buffer

}

exports.connect = connect
exports.publishEvent = publishEvent
