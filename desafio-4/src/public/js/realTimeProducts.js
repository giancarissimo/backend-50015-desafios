const socket = io()

socket.on("products", (data) => {
    renderProducts(data)
})

// Función para renderizar la tabla de productos:
const renderProducts = (products) => {
    const containerProducts = document.getElementById("container_realTimeProducts")
    containerProducts.innerHTML = ""

    products.forEach(product => {
        const card = document.createElement("div")
        card.classList.add("card")
        //Agregamos boton para eliminar:
        card.innerHTML = `
            <p>Id: ${product.id}</p>
            <p>Title: ${product.title}</p>
            <p>Price: ${product.price}</p>
            <p>Status: ${product.status}</p>
            <button class="btn_update">Update</button>
            <button class="btn_delete">Delete</button>
            `
        containerProducts.appendChild(card)

        // Agregamos el evento para actualizar el producto
        card.querySelector(".btn_update").addEventListener("click", () => {
            handleEditProduct(product)
        })

        // Agregamos el evento para eliminar el producto
        card.querySelector(".btn_delete").addEventListener("click", () => {
            deleteProduct(product.id)
        })
    })
}

// Variable para almacenar el producto seleccionado para su edición
let selectedProduct = null

// Función para manejar la actualización o adheción de un producto
const handleProductForm = () => {
    if (!selectedProduct) {
        // Si no hay un producto seleccionado, se agrega uno nuevo
        socket.emit("addProduct", getProductData())
        clearFieldsForm()
    } else {
        // Si hay un producto seleccionado, se actualiza en lugar de agregar
        socket.emit("updateProduct", { productId: selectedProduct.id, updatedProduct: getProductData() })
        clearFieldsForm()
    }

    // Se limpia el producto seleccionado después de la operación
    selectedProduct = null
}

// Función para obtener los datos del formulario
const getProductData = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        price: !selectedProduct ? document.getElementById("price").value : parseFloat(document.getElementById("price").value),
        thumbnail: document.getElementById("thumbnail").value,
        code: document.getElementById("code").value,
        stock: !selectedProduct ? document.getElementById("stock").value : parseInt(document.getElementById("stock").value),
        status: !selectedProduct ? document.getElementById("status").value : document.getElementById("status").value === "true"
    }
    return product
}

// Función para cargar los datos del producto seleccionado al formulario
const loadProductDataForEditing = (product) => {
    document.getElementById("title").value = product.title
    document.getElementById("description").value = product.description
    document.getElementById("category").value = product.category
    document.getElementById("price").value = product.price
    document.getElementById("thumbnail").value = product.thumbnail
    document.getElementById("code").value = product.code
    document.getElementById("stock").value = product.stock
    document.getElementById("status").value = product.status

    // Al cargar los datos, se asigna el producto seleccionado
    selectedProduct = product
}

// Se presoina el boton "update" del producto
const handleEditProduct = (product) => {
    // Se personaliza el comportamiento del formulario
    loadProductDataForEditing(product)
    document.getElementById("form_title").innerText = "Update a product"
}

// Se limpian los campos del formulario
const clearFieldsForm = () => {
    document.getElementById("form_title").innerText = "Add a product"
    document.getElementById("form_products").reset()
    selectedProduct = null
}

// Se envia el formulario
document.getElementById("form_submitBtn").addEventListener("click", handleProductForm)

// Se Limpia y resetea el formulario
document.getElementById("form_clearBtn").addEventListener("click", clearFieldsForm)

// Se elimina un producto
const deleteProduct = (id) => {
    socket.emit("deleteProduct", id)
}