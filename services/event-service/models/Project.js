const mongoose = require('mongoose')


const projectSchema = new mongoose.Schema({
    name: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    apiKey: {
        type: String,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Project', projectSchema)
