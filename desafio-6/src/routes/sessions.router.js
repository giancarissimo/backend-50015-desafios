const express = require("express")
const router = express.Router()
const UserModel = require('../dao/models/user.model.js')
const passport = require("passport")
const { isValidPassword } = require("../utils/hashBcrypt.js")

// Ruta POST /api/sessions/login - se utiliza passport y se inicia la sesión
router.post("/login", async (req, res, next) => {
    const { email, password } = req.body
    // Verificar si los campos están vacíos
    if (!email && !password) {
        // Renderizar la página de inicio de sesión con el mensaje de error
        req.session.errors = { email: "Email address and password are required", password: "Email address and password are required" }
        return res.redirect("/login")
    }
    if (!email) {
        req.session.errors = { email: "Email address is required" }
        return res.redirect("/login")
    }
    if (!password) {
        req.session.errors = { password: "Password is required" }
        return res.redirect("/login")
    }
    const adminUser = {
        username: "Admin",
        first_name: "Private",
        last_name: "Private",
        age: "Private",
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
        role: "admin"
    }
    if (email === adminUser.email && password === adminUser.password) {
        req.session.login = true
        req.session.user = { ...adminUser }
        res.redirect('/products')
        return
    }
    const user = await UserModel.findOne({ email: email })
    if (user) {
        // Se verifica si el email y la contraseña son validos para iniciar sesión
        if (user.email !== email || !isValidPassword(password, user)) {
            req.session.errors = { email: "The email address or password are incorrect", password: "The email address or password are incorrect" }
            return res.redirect("/login")
        }
    } else {
        req.session.errors = { email: "User not found", password: "User not found" }
        return res.redirect("/login")
    }
    next()
}, passport.authenticate("login", {
    failureRedirect: "/api/sessions/failedlogin"
}), async (req, res) => {
    try {
        req.session.user = {
            username: req.user.username,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        }
        req.session.login = true
        res.redirect("/products")

    } catch (error) {
        res.status(500).send({ error: "Error in login" })
    }
})

// Ruta GET /api/sessions/failedlogin - se renderiza la vista cuando hay un error en el login
router.get("/failedlogin", async (req, res) => {
    res.render('failedLogin', { title: "Failed Login" })
})

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get("/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
        req.session.user = req.user
        req.session.login = true
        res.redirect("/products")
    }
)

// Ruta GET /api/sessions/logout - se cierrra la sesión
router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    res.redirect("/login")
})

module.exports = router