const express = require('express')
const router = express.Router()

module.exports = (productManager) => {
    // Ruta para la vista home.handlebars
    router.get('/', async (req, res) => {
        try {
            const products = await productManager.getProducts() // Se obtiene la lista de productos
            res.render('home', { title: 'Home', products }) // Se pasa la lista de productos a la vista
        } catch (error) {
            console.error('Error getting products:', error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    // Ruta para la vista realTimeProducts.handlebars
    router.get('/realtimeproducts', async (req, res) => {
        try {
            res.render('realTimeProducts', { title: 'Real Time Products'})
        } catch (error) {
            console.error('Error getting products:', error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    return router
}
