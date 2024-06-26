import mongoose from "mongoose"

// Se crea el schema y el model de usuarios para github
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
        default: 'user',
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    }
})

const GithubserModel = mongoose.model("githubUser", userSchema)
export default GithubserModel