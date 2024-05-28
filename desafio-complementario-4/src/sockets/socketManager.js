import { Server as socketIo } from 'socket.io'
import ProductServices from '../services/productServices.js'
import MessageModel from '../models/messages.model.js'
import logger from '../utils/logger.js'
const productServices = new ProductServices()

class SocketManager {
    constructor(server) {
        this.io = new socketIo(server)
        this.initSocketEvents()
    }

    async initSocketEvents() {
        // Se configura Socket.IO para escuchar conexiones
        this.io.on('connection', async (socket) => {
            logger.info("A user connected.")

            // Se emite la lista de productos al cliente cuando se conecta
            socket.emit("products", await productServices.getProducts())

            // Se escucha eventos del cliente para agregar productos
            socket.on("addProduct", async (newProduct) => {
                // Se agrega el nuevo producto y emitir la lista actualizada a todos los clientes
                await productServices.addProduct(newProduct)
                this.io.emit("products", await productServices.getProducts())
            })

            // Se escucha eventos del cliente para actualizar productos
            socket.on("updateProduct", async ({ productId, updatedProduct }) => {
                await productServices.updateProduct(productId, updatedProduct)
                this.io.emit("products", await productServices.getProducts())
            })

            // Se escucha eventos del cliente para borrar productos
            socket.on("deleteProduct", async (productId) => {
                // Se borra el producto y emitir la lista actualizada a todos los clientes
                await productServices.deleteProduct(productId)
                this.io.emit("products", await productServices.getProducts())
            })

            // Se emite la lista de mensajes al cliente cuando se conecta
            socket.emit("message", await MessageModel.find())

            // Se envían y reciben mensajes en el chat
            socket.on("message", async (data) => {
                // Guardo el mensaje en MongoDB
                await MessageModel.create(data)

                // Obtengo los mensajes de MongoDB y se los paso al cliente
                const messages = await MessageModel.find()
                this.io.sockets.emit("message", messages)
            })
        })
    }
}
export default SocketManager