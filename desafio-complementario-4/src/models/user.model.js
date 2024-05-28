const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'premium'],
        default: 'user',
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    resetToken: {
        token: String,
        expiresAt: Date
    },
    forTesting: {
        type: Boolean,
        default: false
    }
})

const UserModel = mongoose.model("user", userSchema)

module.exports = UserModel