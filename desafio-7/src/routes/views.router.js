const express = require('express')
const router = express.Router()
const ProductModel = require("../models/products.model.js")

module.exports = (productServices, cartServices) => {
    // Ruta para la vista home.handlebars
    router.get('/', async (req, res) => {
        try {
            const products = await productServices.getProducts() // Se obtiene la lista de productos
            res.render('home', { user: req.session.user, title: 'Home', products }) // Se pasa la lista de productos a la vista
        } catch (error) {
            console.error('Error getting products:', error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    // Ruta para la vista realTimeProducts.handlebars
    router.get('/realtimeproducts', async (req, res) => {
        try {
            // Si el usuario no está loggeado se le redirigirá a la pagina de 'Home'
            if (!req.session.login) {
                return res.redirect('/')
            }
            // Si el usuario es el Administrador tendrá acceso a la pagina 'Real Time Products'
            if (req.session.user.role === 'admin') {
                res.render('realTimeProducts', { user: req.session.user, title: 'Admin Hub' })
            } else {
                return res.redirect('/')
            }
        } catch (error) {
            console.error('Error getting products:', error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    // Ruta para la vista chat.handlebars
    router.get('/chat', async (req, res) => {
        try {
            // Si el usuario no está loggeado se le redirigirá a la pagina de 'Login'
            if (!req.session.login) {
                return res.redirect('/login')
            }
            res.render('chat', { title: 'Community Chat' })
        } catch (error) {
            console.error('Error getting products:', error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    // Ruta para la vista product.handlebars
    router.get('/products', async (req, res) => {
        const page = req.query.page || 1
        const limit = 9

        try {
            const productsList = await ProductModel.paginate({ status: true }, { limit, page })

            const productsFinalResult = productsList.docs.map(product => {
                const { id, ...rest } = product.toObject()
                return rest
            })

            res.render('products', {
                title: 'iStore',
                products: productsFinalResult,
                hasPrevPage: productsList.hasPrevPage,
                hasNextPage: productsList.hasNextPage,
                prevPage: productsList.prevPage,
                nextPage: productsList.nextPage,
                currentPage: productsList.page,
                totalPages: productsList.totalPages,
                user: req.session.user
            })
        } catch (error) {
            console.log("Error en la paginacion ", error)
            res.status(500).send("Error fatal en el server")
        }
    })

    // Ruta para la vista productDetail.handlebars
    router.get('/products/:productId', async (req, res) => {
        try {
            const productId = req.params.productId
            const product = await productServices.getProductById(productId) // se obtiene el producto por su ID
            res.render('productDetail', { title: 'Product Detail', product }) // Se renderiza la vista 'productDetails' con los detalles del producto
        } catch (error) {
            console.error('Error getting product details:', error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    // Ruta para la vista cart.handlebars
    router.get('/carts/:cid', async (req, res) => {
        const cartId = req.params.cid
        try {
            // Se verifica si el carrito existe en el array de carritos
            const cart = await cartServices.getCartById(cartId)
            if (!cart) {
                console.error(`No cart exist with the ID ${cartId}`)
                return cart
            }

            // Se renderiza la vista de carrito con los productos asociados
            res.render('cart', { cartId, products: cart.products, title: 'Cart' })
        } catch (error) {
            console.error("Error retrieving cart:", error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    // Ruta para la vista guestCart.handlebars
    router.get('/cart/guest', async (req, res) => {
        // Se verifica si el usuario está loggeado
        if (!req.session.user) {
            // Si el usuario no está autenticado, renderizar la vista del carrito para invitados
            return res.render('guestCart', { title: 'Guest Cart' })
        }
    })

    // Ruta para la vista login.handlebars
    router.get('/login', (req, res) => {
        // Si el usuario ya está loggeado se le redirigirá a la pagina de 'Home'
        if (req.session.login) {
            return res.redirect('/')
        }
        res.render('login', { title: 'Login' })
    })

    // Ruta para la vista register.handlebars
    router.get('/register', (req, res) => {
        // Si el usuario ya está loggeado se le redirigirá a la pagina 'Home'
        if (req.session.login) {
            return res.redirect('/')
        }
        res.render('register', { title: 'Register' })
    })

    // Ruta para la vista profile.handlebars
    router.get('/profile', (req, res) => {
        // Si el usuario no está loggeado, se deberá loggear
        if (!req.session.login) {
            return res.redirect('/login')
        }
        res.render('profile', { user: req.session.user, title: 'Profile' })
    })

    return router
}
