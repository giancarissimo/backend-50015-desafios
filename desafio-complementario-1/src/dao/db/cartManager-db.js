const CartModel = require("../models/carts.model.js")

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] })
            await newCart.save()
            return newCart
        } catch (error) {
            console.log("Error creating a cart", error)
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId)
            if (!cart) {
                console.log(`No cart exist with the id ${cartId}`)
                return null
            }

            return cart
        } catch (error) {
            cconsole.log("Error retrieving the cart by id", error)
        }
    }

    async addProductToCart(cartId, productId, quantity = 1, productManager) {
        try {
            // Se verifica si el carrito existe en el array de carritos
            const cart = await this.getCartById(cartId)
            if (!cart) {
                console.error(`No cart exists with the id ${cartId}`)
                return cartId
            }

            // Se verifica si el producto existe en el array de productos
            const product = await productManager.getProductById(productId)
            if (!product) {
                console.error(`A product with the id ${productId} was not found.`)
                return productId
            }

            // Se verifica si el producto ya existe en el carrito y, sino, se agrega.
            const productExist = cart.products.find(p => p.product.equals(productId))
            if (productExist) {
                productExist.quantity += quantity
            } else {
                cart.products.push({ product: productId, quantity })
            }

            // Se marca la propiedad "products" como modificada antes de guardar
            cart.markModified("products")

            await cart.save()
            return cart

        } catch (error) {
            console.log("Error adding a product to the cart", error)
        }
    }
}

module.exports = CartManager