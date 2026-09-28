const mongoose = require('mongoose')


const eventSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        index: true
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


eventSchema.index({projectId: 1, eventName: 1});

eventSchema.index({projectId:1, timestamp: 1})

module.exports = mongoose.model('Event', eventSchema)
