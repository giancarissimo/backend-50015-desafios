const ProductModel = require("../models/products.model.js")
const logger = require("../utils/logger.js")

class ProductServices {
    async addProduct({ title, description, category, price, code, stock, status, thumbnails, owner, forTesting }) {
        try {
            // Se valida que todos los campos sean obligatorios
            if (!title || !description || !category || !price || !code || !stock || status == undefined || status == null) {
                logger.error("All fields are mandatory.")
                return
            }

            // Se valida que no se repita el campo "code"
            const productExists = await ProductModel.findOne({ code: code })

            if (productExists) {
                logger.error("A product with that code already exists.")
                return
            }

            const newProduct = new ProductModel({
                title,
                description,
                category,
                price,
                code,
                stock,
                status,
                thumbnails: thumbnails || [],
                owner,
                forTesting
            })

            await newProduct.save()
            logger.info(`Product created: ${JSON.stringify(newProduct)}`)
        } catch (error) {
            logger.error("Error adding the product:", error)
            throw error
        }
    }

    async getProducts() {
        try {
            const products = await ProductModel.find()
            logger.info(`Products: ${JSON.stringify(products)}`)
            return products
        } catch (error) {
            logger.error("Error getting the products", error)
        }
    }

    async getProductById(id) {
        try {
            const foundProduct = await ProductModel.findById(id)

            if (!foundProduct) {
                logger.error(`A product with the id ${id} was not found.`)
                return null
            }

            logger.info(`Product found: ${JSON.stringify(foundProduct)}`)
            return foundProduct
        } catch (error) {
            logger.error("Error getting a product by id:", error)
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const productToUpdate = await ProductModel.findByIdAndUpdate(id, updatedProduct)

            if (!productToUpdate) {
                logger.error(`A product with the id ${id} was not found.`)
                return null
            }

            logger.info(`Product updated: ${JSON.stringify(updatedProduct)}`)
            return productToUpdate
        } catch (error) {
            logger.error("Error updating the product", error)
        }
    }

    async deleteProduct(id) {
        try {
            const productToDelete = await ProductModel.findByIdAndDelete(id)

            if (!productToDelete) {
                logger.error(`A product with the id ${id} was not found.`)
                return null
            }

            logger.info(`Product deleted: ${JSON.stringify(productToDelete)}`)
        } catch (error) {
            logger.error("Error updating the product")
            throw error
        }
    }

    async getProductsLimit(limit) {
        const products = await ProductModel.find()
        if (limit) {
            return products.slice(0, limit)
        }
        return products
    }
}

module.exports = ProductServices