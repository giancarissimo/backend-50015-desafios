import mongoose from "mongoose"

// Se crea el schema y el model de usuarios
const userSchema = new mongoose.Schema({
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
    documents: [{
        name: String,
        reference: String
    }],
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

const UserModel = mongoose.model("user", userSchema)
export default UserModel