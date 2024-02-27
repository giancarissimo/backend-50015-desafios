const express = require("express")
const router = express.Router()
const UserModel = require('../dao/models/user.model.js')

// Ruta POST /api/sessions/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    const adminUser = {
        username: "Admin",
        first_name: "Private",
        last_name: "Private",
        age: "Private",
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
        role: "admin"
    }
    try {
        const user = await UserModel.findOne({ email: email })

        if (email === adminUser.email && password === adminUser.password) {
            req.session.login = true
            req.session.user = { ...adminUser }
            res.redirect('/products')
            return
        }

        if (user) {
            // Se verifica si el email y la contraseña son validos para iniciar sesión
            if (user.email === email && user.password === password) {
                req.session.login = true
                req.session.user = {
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    age: user.age,
                    role: user.role
                }
                res.redirect("/products")
            } else {
                res.status(401).send({ error: "The email address or password are incorrect" })
            }
        } else {
            res.status(404).send({ error: "User not found" })
        }
    } catch (error) {
        res.status(500).send({ error: "Error in login" })
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