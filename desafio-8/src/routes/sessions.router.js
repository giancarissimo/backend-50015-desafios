const express = require("express")
const SessionController = require("../controllers/session.controller")
const router = express.Router()

module.exports = (sessionController) => {
    // Ruta POST /api/sessions/login - se utiliza passport y se inicia la sesión
    router.post("/login", sessionController.loginUser, sessionController.handleUserLogin, sessionController.renderLoginSuccess)

    // Ruta GET /api/sessions/failedlogin - se renderiza la vista cuando hay un error en el login
    router.get("/failedlogin", sessionController.renderFailedLogin)

    router.get("/github", sessionController.authenticateGithub)

    router.get("/githubcallback", sessionController.githubCallback)

    // Ruta GET /api/sessions/current - se muestra el usuario actual
    router.get("/current", sessionController.current)

    // Ruta GET /api/sessions/logout - se cierrra la sesión
    router.get("/logout", sessionController.logout)

    return router
}