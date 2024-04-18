const express = require("express")
const router = express.Router()

module.exports = (userController) => {
    // Ruta POST /api/users - se utiliza passport generando un usuario y almacenandolo en MongoDB
    router.post("/", userController.registerUser, userController.handleUserRegistration, userController.renderRegisterSuccess)

    // Ruta GET /api/users/failedregister - se renderiza la vista cuando hay un error en el registro de usuario
    router.get("/failedregister", userController.renderFailedRegister)

    return router
}