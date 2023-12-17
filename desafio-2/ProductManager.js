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
}

/* -------------------- Testing -------------------- */
async function testing() {
    const manager = new ProductManager('desafio-2/products.json')

    // Se obtiene el array vacío.
    console.log(manager.getProducts())

    // Se agregan 11 productos y se testea el id autoincrementable.
    await manager.addProduct({
        title: "Product 1",
        description: "Description 1",
        price: 10.00,
        thumbnail: "image1.jpg",
        code: "CODE1",
        stock: 20
    })

    await manager.addProduct({
        title: "Product 2",
        description: "Description 2",
        price: 20.00,
        thumbnail: "image2.jpg",
        code: "CODE2",
        stock: 20
    })

    await manager.addProduct({
        title: "Product 3",
        description: "Description 3",
        price: 30.00,
        thumbnail: "image3.jpg",
        code: "CODE3",
        stock: 20
    })

    await manager.addProduct({
        title: "Product 4",
        description: "Description 4",
        price: 40,
        thumbnail: "image4.jpg",
        code: "CODE4",
        stock: 20
    })

    await manager.addProduct({
        title: "Product 5",
        description: "Description 5",
        price: 50.00,
        thumbnail: "image5.jpg",
        code: "CODE5",
        stock: 20
    })

    await manager.addProduct({
        title: "Product 6",
        description: "Description 6",
        price: 60.00,
        thumbnail: "image6.jpg",
        code: "CODE6",
        stock: 20
    })

    await manager.addProduct({
        title: "Product 7",
        description: "Description 7",
        price: 70.00,
        thumbnail: "image7.jpg",
        code: "CODE7",
        stock: 20
    })

    await manager.addProduct({
        title: "Product 8",
        description: "Description 8",
        price: 80.00,
        thumbnail: "image8.jpg",
        code: "CODE8",
        stock: 20
    })

    await manager.addProduct({
        title: "Product 9",
        description: "Description 9",
        price: 90.00,
        thumbnail: "image9.jpg",
        code: "CODE9",
        stock: 20
    })

    await manager.addProduct({
        title: "Product 10",
        description: "Description 10",
        price: 100.00,
        thumbnail: "image10.jpg",
        code: "CODE10",
        stock: 20
    })

    await manager.addProduct({
        title: "Product 11",
        description: "Description 11",
        price: 110.99,
        thumbnail: "image11.jpg",
        code: "CODE11",
        stock: 20
    })

    console.log("Todos los productos:", manager.getProducts());

    // Se testea que todos los campos sean obligatorios.
    await manager.addProduct({
        title: "Product 12",
        // description: "Description 12",
        price: 121.99,
        thumbnail: "image12.jpg",
        code: "CODE12",
        stock: 20
    })

    // Se testea que el "code" no se repita en los productos.
    await manager.addProduct({
        title: "Product 13",
        description: "Description 13",
        price: 132.99,
        thumbnail: "image13.jpg",
        code: "CODE1",
        stock: 20
    })

    // Se busca un producto por id
    try {
        const product = await manager.getProductById(2)
        console.log("Producto encontrado:", product)
    } catch (error) {
        console.error(error)
    }

    // Se actualiza un producto.
    const product1New = {
        id: 1,
        title: "product 1 new",
        description: "Description 1 new",
        price: 10,
        thumbnail: "image1New.jpg",
        code: "CODE1",
        stock: 20
    }

    try {
        await manager.updateProduct(1, product1New)
    } catch (error) {
        console.error(error)
    }

    // Se elimina un producto
    try {
        await manager.deleteProduct(11)
    } catch (error) {
        console.error(error)
    }
}
testing()