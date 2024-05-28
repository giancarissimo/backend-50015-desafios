const express = require('express')
const router = express.Router()

module.exports = (loggerController) => {
    // Ruta GET /loggertest - se testean los errores
    router.get("/", loggerController.testingLogger)

    return router
}