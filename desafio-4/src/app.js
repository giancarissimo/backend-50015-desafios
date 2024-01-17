const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const expressHandlebars = require('express-handlebars')
const ProductManager = require('./controllers/ProductManager')
const CartManager = require('./controllers/CartManager')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const PORT = 8080

const productManager = new ProductManager('./src/models/products.json', io)
const cartManager = new CartManager('./src/models/carts.json')

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Handlebars
app.engine('handlebars', expressHandlebars.engine())
app.set('view engine', 'handlebars')
app.set("views", "./src/views")

//Routing
app.use("/", require("./routes/views.router")(productManager))

// Rutas de productos
app.use('/api/products', require('./routes/products.router')(productManager))

// Rutas de carritos
app.use('/api/carts', require('./routes/cart.router')(cartManager, productManager))

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('./src/public'))

// Se configura Socket.IO para escuchar conexiones
io.on('connection', async (socket) => {
    console.log('A user connected')

    // Se emite la lista de productos al cliente cuando se conecta
    socket.emit("products", await productManager.getProducts())

    // Se escucha eventos del cliente para agregar y borrar productos
    socket.on("addProduct", async (newProduct) => {
        // Se agrega el nuevo producto y emitir la lista actualizada a todos los clientes
        await productManager.addProduct(newProduct)
        io.emit("products", await productManager.getProducts())
    })

    socket.on("deleteProduct", async (productId) => {
        // Se borra el producto y emitir la lista actualizada a todos los clientes
        await productManager.deleteProduct(productId)
        io.emit("products", await productManager.getProducts())
    })
})

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
