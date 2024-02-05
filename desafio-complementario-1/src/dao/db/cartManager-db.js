const CartModel = require("../models/carts.model.js")

class CartManager {
    async createCart() {
        try {
            const nuevoCarrito = new CartModel({ products: [] })
            await nuevoCarrito.save()
            return nuevoCarrito
        } catch (error) {
            console.log("Error creating a cart", error)
        }
    }

    async getCartById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId)
            if (!carrito) {
                console.log("No existe ese carrito con el id")
                return null
            }

            return carrito
        } catch (error) {
            cconsole.log("Error retrieving the cart by id", error)
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId)
            const existeProducto = carrito.products.find(item => item.product.toString() === productId)

            if (existeProducto) {
                existeProducto.quantity += quantity
            } else {
                carrito.products.push({ product: productId, quantity })
            }

            //Vamos a marcar la propiedad "products" como modificada antes de guardar:
            carrito.markModified("products")

            await carrito.save()
            return carrito

        } catch (error) {
            console.log("Error adding a product to the cart", error)
        }
    }
}

module.exports = CartManager