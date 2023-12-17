const fs = require('fs')

class ProductManager {
    constructor(filePath) {
        this.products = []
        this.path = filePath
    }

    static lastId = 0 // Para generar IDs autoincrementables

    async addProduct(newObject) {
        let { title, description, price, thumbnail, code, stock } = newObject

        // Se valida que todos los campos sean obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios.")
            return
        }

        // Se valida que no se repita el campo "code"
        if (this.products.some(product => product.code === code)) {
            console.error("Ya existe un producto con ese código.")
            return
        }

        // Se agrega un producto con id autoincrementable
        const newProduct = {
            id: ++ProductManager.lastId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        this.products.push(newProduct)
        console.log("Producto agregado:", newProduct)

        // Guardar el array actualizado en el archivo
        await this.saveFile(this.products)
    }

    async getProducts() {
        return this.products
    }

    async getProductById(id) {
        try {
            const arrayProducts = await this.readFile()
            const foundProduct = arrayProducts.find(item => item.id === id)
            if (!foundProduct) {
                console.error("Producto no encontrado. ID:", id)
            } else {
                console.log("Producto encontrado:", foundProduct)
                return foundProduct
            }
        } catch (error) {
            console.log("Error al leer el archivo", error)
        }
    }

    async readFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8')
            const arrayProducts = JSON.parse(data)
            return arrayProducts
        } catch (error) {
            console.log("Error al leer un archivo", error)
        }
    }

    async saveFile(arrayProducts) {
        try {
            fs.writeFileSync(this.path, JSON.stringify(arrayProducts, null, 4))
        } catch (error) {
            console.log("Error al guardar el archivo", error)
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const arrayProducts = await this.readFile()
            const index = arrayProducts.findIndex(product => product.id === id)
            if (index !== -1) {
                // Se actualiza el producto
                arrayProducts.splice(index, 1, updatedProduct)
                await this.saveFile(arrayProducts)
                console.log("Producto actualizado:", updatedProduct)
            } else {
                console.error("Producto no encontrado. ID:", id)
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error)
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProducts = await this.readFile()
            const index = arrayProducts.findIndex(product => product.id === id)
            if (index !== -1) {
                // Se Elimina el producto
                const deletedProduct = arrayProducts.splice(index, 1)
                await this.saveFile(arrayProducts)
                console.log("Producto eliminado:", deletedProduct)
            } else {
                console.error("Producto no encontrado. ID:", id)
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error)
        }
    }

    async getProductsLimit(limit) {
        const arrayProducts = await this.readFile()
        if (limit) {
            return arrayProducts.slice(0, limit)
        }
        return arrayProducts
    }

}

module.exports = ProductManager