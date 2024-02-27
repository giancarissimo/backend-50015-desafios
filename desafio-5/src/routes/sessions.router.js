const express = require("express")
const router = express.Router()
const UserModel = require('../dao/models/user.model.js')

// Ruta POST /api/sessions/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const usuario = await UserModel.findOne({ email: email })
        if (usuario) {
            // Se verifica si la contraseña es valida para verificar el inicio de sesion
            if (usuario.password === password) {
                req.session.login = true
                req.session.user = {
                    email: usuario.email,
                    age: usuario.age,
                    first_name: usuario.first_name,
                    last_name: usuario.last_name,
                    role: usuario.role
                }
                res.redirect("/products")
            } else {
                res.status(401).send({ error: "Invalid password" })
            }
        } else {
            res.status(404).send({ error: "User not found" })
        }
    } catch (error) {
        res.status(400).send({ error: "Error in login" })
    }
})

// Ruta GET /api/sessions/logout - se cierrra la sesión
router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    res.redirect("/login")
})

module.exports = router