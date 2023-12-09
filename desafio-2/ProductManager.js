const fs = require('fs').promises

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

    getProducts() {
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
            const data = await fs.readFile(this.path, 'utf8')
            const arrayProducts = JSON.parse(data)
            return arrayProducts
        } catch (error) {
            console.log("Error al leer un archivo", error)
        }
    }

    async saveFile(arrayProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 4))
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
}

/* -------------------- Testing -------------------- */
const manager = new ProductManager('desafio-2/productos.json')

// Se obtiene el array vacío.
manager.getProducts()

// Se agregan 2 productos y se testea el id autoincrementable.
manager.addProduct({
    title: "Product 1",
    description: "Description 1",
    price: 10.99,
    thumbnail: "image1.jpg",
    code: "CODE1",
    stock: 20
})

manager.addProduct({
    title: "Product 2",
    description: "Description 2",
    price: 20.99,
    thumbnail: "image2.jpg",
    code: "CODE2",
    stock: 20
})

console.log("Todos los productos:", manager.getProducts())

// Se testea que todos los campos sean obligatorios.
manager.addProduct({
    title: "Product 3",
    // description: "Description 3",
    price: 25.99,
    thumbnail: "image3.jpg",
    code: "CODE3",
    stock: 20
})

// Se testea que el "code" no se repita en los productos.
manager.addProduct({
    title: "Product 4",
    description: "Description 4",
    price: 35.99,
    thumbnail: "image3.jpg",
    code: "CODE2",
    stock: 20
})

// Se busca un producto por id
async function testGetProductById() {
    await manager.getProductById(2)
}
testGetProductById()

// Se actualiza un producto.
const product1New = {
    title: "product 1 new",
    description: "Description 1 new",
    price: 10.99,
    thumbnail: "image1New.jpg",
    code: "CODE1",
    stock: 20
}

async function testUpdateProduct() {
    await manager.updateProduct(1, product1New)
}
testUpdateProduct()

// Se elimina un producto
async function testDeleteProduct() {
    await manager.deleteProduct(2)
}
testDeleteProduct()
