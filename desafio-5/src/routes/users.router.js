const express = require("express")
const router = express.Router()
const UserModel = require('../dao/models/user.model.js')

// Ruta POST /api/users - Se genera un usuario y se almacena en MongoDB
router.post("/", async (req, res) => {
    const { username, first_name, last_name, email, password, age, role = "user" } = req.body

    try {
        // Se verifica si el correo electrónico ya está registrado
        const existingUserEmail = await UserModel.findOne({ email: email })
        if (existingUserEmail) {
            return res.status(400).send({ error: "The email address is already registered" })
        }

        // Se verifica si el username ya está registrado
        const existingUseUsername = await UserModel.findOne({ username: username })
        if (existingUseUsername || username === "Admin") {
            return res.status(400).send({ error: "The username is already registered" })
        }

        // Se crea un nuevo usuario
        const newUser = await UserModel.create({ username, first_name, last_name, email, password, age, role })

        // Se almacena información del usuario en la sesión
        // req.session.login = true
        req.session.user = { ...newUser._doc }

        // res.status(200).send({ message: "User created successfully" })
        res.redirect('/login')
    } catch (error) {
        console.error("Error creating the user:", error)
        res.status(500).send({ error: "Internal server error" })
    }
})

module.exports = router