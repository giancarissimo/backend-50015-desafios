const express = require('express')
const router = express.Router()

module.exports = (viewsController) => {
    // Ruta para la vista home.handlebars
    router.get('/', viewsController.renderHome)

    // Ruta para la vista realTimeProducts.handlebars
    router.get('/realtimeproducts', viewsController.renderAdminPage)

    // Ruta para la vista product.handlebars
    router.get('/products', viewsController.renderStore)

    // Ruta para la vista productDetail.handlebars
    router.get('/products/:productId', viewsController.renderProductDetail)

    // Ruta para la vista chat.handlebars
    router.get('/chat', viewsController.renderChat)

    // Ruta para la vista profile.handlebars
    router.get('/account', viewsController.renderAccount)

    // Ruta para la vista guestCart.handlebars
    router.get('/cart/guest', viewsController.renderCartGuest)

    // Ruta para la vista cart.handlebars
    router.get('/carts/:cid', viewsController.renderUserCart)

    // Ruta para la vista login.handlebars
    router.get('/login', viewsController.renderLogin)

    // Ruta para la vista register.handlebars
    router.get('/register', viewsController.renderRegister)

    return router
}