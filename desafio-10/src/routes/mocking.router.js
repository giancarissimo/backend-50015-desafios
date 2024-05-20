const express = require("express")
const router = express.Router()

module.exports = (mockingController) => {
    // Ruta GET /mockingproducts - se generan 100 productsos de manera aleatoria
    router.get("/", mockingController.generateProducts)

    return router
}