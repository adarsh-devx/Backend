const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: [true , 'with this email user account already exist'],
        // match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
    }
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel