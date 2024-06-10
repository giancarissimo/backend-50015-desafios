import mongoose from "mongoose"

// Se crea el schema y el model de usuarios para google
const googleUserSchema = new mongoose.Schema({
    googleId : {
        type: String,
        required: true
    },
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
        required: false
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    age: {
        type: Number,
        required: false
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
    documents: [{
        name: String,
        reference: String,
    }],
    resetToken: {
        token: String,
        expiresAt: Date,
    },
    last_connection: {
        type: Date,
        default: Date.now
    },
    forTesting: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false // Se excluye el campo _v globalmente
})

const GoogleUserModel = mongoose.model("googleUser", googleUserSchema)
export default GoogleUserModel