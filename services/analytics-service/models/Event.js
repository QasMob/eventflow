const mongoose = require('mongoose')


const eventSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    // end user
    userId: {
        type: String
    },
    eventName: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    properties: {
        type: mongoose.Schema.Types.Mixed
    }
})


module.exports = mongoose.model('Event', eventSchema)
