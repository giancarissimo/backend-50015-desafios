class ProductManager {
    constructor() {
        this.products = []
    }

    static lastId = 0 // Para generar IDs autoincrementables

    addProduct(title, description, price, thumbnail, code, stock) {
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
    }

    getProducts() {
        return this.products
    }

    getProductById(id) {
        const foundProduct = this.products.find(product => product.id === id)

        if (foundProduct) {
            console.log("Producto encontrado:", foundProduct)
        } else {
            console.error("Producto no encontrado. ID:", id)
        }

        return foundProduct
    }
}

/* -------------------- Testing -------------------- */
const manager = new ProductManager()

manager.addProduct("Producto 1", "Descripción 1", 10.99, "imagen1.jpg", "CODE1", 20)
manager.addProduct("Producto 2", "Descripción 2", 19.99, "imagen2.jpg", "CODE2", 15)

console.log("Todos los productos:", manager.getProducts())
manager.getProductById(1)
manager.getProductById(3) // Se provoca un error "Not found"