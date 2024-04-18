require('./database.js')
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const http = require('http')
const expressHandlebars = require('express-handlebars')
const ProductController = require('./controllers/product.controller.js')
const CartController = require('./controllers/cart.controller.js')
const UserController = require('./controllers/user.controller.js')
const SessionController = require('./controllers/session.controller.js')
const ViewsController = require('./controllers/views.controller.js')
const MockingController = require('./controllers/mocking.controller.js')
const handleError = require('./middleware/handleError.js')
const MongoStore = require('connect-mongo')

// Variables de entorno
const configObject = require("./config/config.js")
const { app_port, mongo_url } = configObject

const app = express()
const server = http.createServer(app)
const PORT = app_port

// Nuevas instancias de las Clases
const productController = new ProductController()
const cartController = new CartController()
const userController = new UserController()
const sessionController = new SessionController()
const viewsController = new ViewsController()
const mockingController = new MockingController()

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
        mongoUrl: mongo_url, ttl: 3600
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

// Variables globales para el sitio
app.use((req, res, next) => {
    res.locals.user = req.session.user // Establecer datos del usuario para todas las vistas
    res.locals.isUserAdmin = req.session.user && req.session.user.role === 'admin' // Verifica si el usuario es administrador
    next() // Continuar con la solicitud
})

// Routing
app.use("/", require("./routes/views.router")(viewsController)) // Rutas de vistas
app.use('/api/products', require('./routes/products.router')(productController)) // Rutas de productos
app.use('/api/carts', require('./routes/cart.router')(cartController)) // Rutas de carritos
app.use('/api/users', require('./routes/users.router')(userController)) // Rutas de usuarios
app.use('/api/sessions', require('./routes/sessions.router')(sessionController)) // Rutas de sessions
app.use('/mockingproducts', require('./routes/mocking.router.js')(mockingController)) // Ruta de productos fake
app.use(handleError)

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('./src/public'))

// Configuración de manejo de errores 404 - Página no encontrada
app.use((req, res, next) => {
    res.status(404).render('notFound', { title: 'Page Not Found' })
})

// Websockets
const SocketManager = require('./sockets/socketManager.js')
new SocketManager(server)

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})