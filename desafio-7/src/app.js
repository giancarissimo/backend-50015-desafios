require('./database.js')
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const http = require('http')
const socketIo = require('socket.io')
const expressHandlebars = require('express-handlebars')
const ProductServices = require('./services/productServices.js')
const CartServices = require('./services/cartServices.js')
const ProductController = require('./controllers/product.controller.js')
const CartController = require('./controllers/cart.controller.js')
const MessageModel = require('./models/messages.model.js')
const MongoStore = require('connect-mongo')

// Variables de entorno
const configObject = require("./config/config.js")
const { app_port, mongo_url } = configObject

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const PORT = app_port

// Nuevas instancias de las Clases
const productServices = new ProductServices()
const cartServices = new CartServices()
const productController = new ProductController()
const cartController = new CartController()

// Passport
const passport = require("passport")
const initializePassport = require("./config/passport.config.js")

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: mongo_url, ttl: 100
    })
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Handlebars
const hbs = expressHandlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set("views", "./src/views")

// Routing
app.use("/", require("./routes/views.router")(productServices, cartServices)) // Rutas de vistas
app.use('/api/products', require('./routes/products.router')(productController)) // Rutas de productos
app.use('/api/carts', require('./routes/cart.router')(cartController)) // Rutas de carritos
app.use('/api/users', require('./routes/users.router')) // Rutas de usuarios
app.use('/api/sessions', require('./routes/sessions.router')) // Rutas de sessions

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('./src/public'))

// Configuración de manejo de errores 404 - Página no encontrada
app.use((req, res, next) => {
    res.status(404).render('notFound', { title: 'Page Not Found' })
})

// Se configura Socket.IO para escuchar conexiones
io.on('connection', async (socket) => {
    console.log('A user connected')

    // Se emite la lista de productos al cliente cuando se conecta
    socket.emit("products", await productServices.getProducts())

    // Se escucha eventos del cliente para agregar productos
    socket.on("addProduct", async (newProduct) => {
        // Se agrega el nuevo producto y emitir la lista actualizada a todos los clientes
        await productServices.addProduct(newProduct)
        io.emit("products", await productServices.getProducts())
    })

    // Se escucha eventos del cliente para actualziar productos
    socket.on("updateProduct", async ({ productId, updatedProduct }) => {
        await productServices.updateProduct(productId, updatedProduct)
        io.emit("products", await productServices.getProducts())
    })

    // Se escucha eventos del cliente para borrar productos
    socket.on("deleteProduct", async (productId) => {
        // Se borra el producto y emitir la lista actualizada a todos los clientes
        await productServices.deleteProduct(productId)
        io.emit("products", await productServices.getProducts())
    })

    // Chat
    socket.on("message", async data => {
        // Guardo el mensaje en MongoDB
        await MessageModel.create(data)

        // Obtengo los mensajes de MongoDB y se los paso al cliente
        const messages = await MessageModel.find()
        console.log(messages)
        io.sockets.emit("message", messages)
    })
})

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})

// File system
// const ProductManager = require('./dao/fs/ProductManager')
// const CartManager = require('./dao/fs/CartManager')
// const productManager = new ProductManager('./src/dao/fs/products.json')
// const cartManager = new CartManager('./src/dao/fs/carts.json')