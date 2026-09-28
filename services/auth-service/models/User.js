const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')



const userSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function(next) {

    if (!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12)

})

userSchema.methods.comparePassword  = async function(canidatePassword){
    return await bcrypt.compare(canidatePassword, this.password)
}


module.exports = mongoose.model('User', userSchema)
