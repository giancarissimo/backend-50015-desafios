const express = require('express')
const ProductManager = require('./ProductManager.js')

const app = express()
const PORT = 8080 // Se puede cambiar el puerto según la preferencia

const manager = new ProductManager('./src/products.json')

// Endpoint para obtener todos los productos o limitar según la query param
app.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        const products = await manager.getProductsLimit(limit)
        res.json(products)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Endpoint para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid)
        const product = await manager.getProductById(productId)
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ error: 'Product not found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})

