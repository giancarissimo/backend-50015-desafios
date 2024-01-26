const express = require('express')
const router = express.Router()

module.exports = (productManager) => {
    // Ruta GET /api/products - se listan todos los productos con o sin un limite de muestra
    router.get('/', async (req, res) => {
        try {
            const limit = parseInt(req.query.limit)
            const products = await productManager.getProductsLimit(limit)
            res.json(products)
        } catch (error) {
            console.error("Error getting the products", error)
            res.status(500).json({ error: `Internal Server Error.` })
        }
    })

    // Ruta GET /api/products/:pid - se obtiene un producto por su id
    router.get('/:pid', async (req, res) => {
        try {
            const productId = parseInt(req.params.pid)
            const product = await productManager.getProductById(productId)
            if (!product) {
                res.status(400).json({ error: `A product with the id ${productId} was not found.` })
            } else {
                res.json({ message: "Product found:", product })
            }
        } catch (error) {
            console.error("Error getting the product", error)
            res.status(500).json({ error: `Internal Server Error.` })
        }
    })

    // Ruta POST /api/products - se añade un producto
    router.post('/', async (req, res) => {
        try {
            const newProduct = req.body
            const requiredFields = ["title", "description", "category", "price", "thumbnail", "code", "stock"]
            const missingFields = requiredFields.filter(field => !(field in newProduct) || (typeof newProduct[field] === "string" && newProduct[field].trim() === ""))

            if (missingFields.length > 0) {
                return res.status(400).json({ message: "All fields are mandatory." })
            }

            const products = await productManager.getProducts()
            const existingProduct = products.find(product => product.code === newProduct.code)

            if (existingProduct) {
                return res.status(400).json({ message: "A product with that code already exists." })
            }

            await productManager.addProduct(newProduct)
            res.json({ message: "Product added successfully", newProduct })
        } catch (error) {
            console.error("Error adding the product", error)
            res.status(500).json({ error: `Internal Server Error.` })
        }
    })

    // Ruta PUT /api/products/:pid - se actualiza un producto
    router.put('/:pid', async (req, res) => {
        try {
            const productId = parseInt(req.params.pid)
            const updatedProduct = req.body
            const productToUpdate = await productManager.updateProduct(productId, updatedProduct)
            if (!productToUpdate) {
                return res.status(400).json({ error: `A product with the id ${productId} was not found.` })
            } else {
                return res.json({ message: "Product updated successfully:", updatedProduct })
            }
        } catch (error) {
            console.error("Error updating the product", error)
            res.status(500).json({ error: `Internal Server Error.` })
        }
    })

    // Ruta DELETE /api/products/:pid - se elimina un producto
    router.delete('/:pid', async (req, res) => {
        try {
            const productId = parseInt(req.params.pid)
            const productToDelete = await productManager.deleteProduct(productId)
            if (!productToDelete) {
                return res.status(400).json({ error: `A Product with the id ${productId} was not found.` })
            } else {
                return res.json({ message: "Product deleted successfully:", productToDelete })
            }
        } catch (error) {
            console.error("Error deleting the product", error)
            res.status(500).json({ error: `Internal Server Error.` })
        }
    })

    return router
}