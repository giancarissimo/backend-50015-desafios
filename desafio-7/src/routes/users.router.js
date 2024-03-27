const express = require("express")
const router = express.Router()
const UserModel = require('../models/user.model.js')
const passport = require("passport")

// Ruta POST /api/users - se utiliza passport generando un usuario y almacenandolo en MongoDB
router.post("/", async (req, res, next) => {
    const { username, first_name, last_name, email, password, age } = req.body
    const errors = {}

    // Se valida si hay un campo vacío
    if (!username) {
        errors.username = "Username is required"
    }
    if (!first_name) {
        errors.first_name = "First name is required"
    }
    if (!last_name) {
        errors.last_name = "Last name is required"
    }
    if (!email) {
        errors.email = "Email address is required"
    }
    if (!password) {
        errors.password = "Password is required"
    }
    if (!age) {
        errors.age = "Age is required"
    }

    // Se valida si el username ya está registrado
    const existingUsername = await UserModel.findOne({ username: username })
    if (existingUsername || username === "Admin") {
        errors.username = "The username is already registered"
    }

    // Se valida si el correo electrónico ya está registrado
    const existingUserEmail = await UserModel.findOne({ email: email })
    if (existingUserEmail || email === "adminCoder@coder.com") {
        errors.email = "The email address is already registered"
    }

    // Se valida la longitud de la contraseña
    if (password.length > 0 && password.length < 8) {
        errors.password = "Password must be at least 8 characters long"
    }

    // Se valida la edad mínima
    if (age > 0 && age < 18) {
        errors.age = "You must be at least 18 years old to register"
    }

    // Se verifica si hay algun error presente
    if (Object.keys(errors).length > 0) {
        return res.render("register", { title: "Register", errors })
    }

    next()
}, passport.authenticate("register", {
    failureRedirect: "api/users/failedregister"
}), async (req, res) => {
    req.session.user = {
        username: req.user.username,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
        cart: req.user.cart
    }

    res.render("registerSuccess", { title: 'Register Success' })
})

// Ruta GET /api/users/failedregister - se renderiza la vista cuando hay un error en el registro de usuario
router.get("/failedregister", (req, res) => {
    res.render("failedRegister", { title: 'Failed Register' })
})

module.exports = router