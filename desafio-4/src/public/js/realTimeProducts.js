const socket = io()

socket.on("products", (data) => {
    renderProducts(data)
})

// Función para renderizar la tabla de productos:
const renderProducts = (products) => {
    const containerProducts = document.getElementById("containerRealTimeProductos")
    containerProducts.innerHTML = ""

    products.forEach(item => {
        const card = document.createElement("div")
        card.classList.add("card")
        //Agregamos boton para eliminar:
        card.innerHTML = `
                <p>Id ${item.id}</p>
                <p>Titulo ${item.title}</p>
                <p>Precio ${item.price}</p>
                <button>Eliminar Producto</button>
                `
        containerProducts.appendChild(card)

        //Agregamos el evento eliminar producto:
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item.id)
        })
    })
}

// Se elimina un producto
const deleteProduct = (id) => {
    socket.emit("deleteProduct", id)
}

// Se agrega un producto
document.getElementById("btnEnviar").addEventListener("click", () => {
    addProduct()
})

const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        status: document.getElementById("status").value === "true"
    }

    socket.emit("addProduct", product)
}