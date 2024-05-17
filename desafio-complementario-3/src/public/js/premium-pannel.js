const socket = io()
const userEmail = document.querySelector('#userEmail')
const userRole = document.querySelector('#userRole')
const premiumProductForm = document.querySelector('#premium_productForm')

socket.on("products", (data) => {
    renderProducts(data)
})

// Función para renderizar la tabla de productos:
const renderProducts = (products) => {
    const containerProducts = document.getElementById("container_premium")
    containerProducts.innerHTML = ""

    products.forEach(product => {
        if (product.owner === userEmail) {
            const productCard = document.createElement("div")
            productCard.classList.add("productCard_premium")
            // Se renderiza cada card
            productCard.innerHTML = `
                ${product.status ? '<span class="productCard_premium_available">AVAILABLE</span>' : '<span class="productCard_premium_notAvailable">NOT AVAILABLE</span>'}
                <h3>${product.title}</h3>
                <img class="productCard_premium_img" src = "../assets/images/store/${product.thumbnails}" alt="${product.title}"></img>
                <div class="productCard_premium_info">
                    <div class="productCard_premium_info_text">
                        <h4>From $${parseFloat(product.price).toFixed(2)}</h4>
                    </div>
                    <a><button class="productCard_premium_buttonHover" id="btn_premium_delete">delete</button></a>
                </div>
                `
            containerProducts.appendChild(productCard)
        }
    })
}

// Función para obtener los datos del formulario y enviarlo
const getProductData = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        price: document.getElementById("price").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        status: document.getElementById("productStatus").value,
        // thumbnails: document.getElementById("thumbnail").value,
        owner: userEmail.innerText
    }
    return product
}

premiumProductForm.addEventListener('submit', (event) => {
    event.preventDefault()
    socket.emit("addProduct", getProductData())
    premiumProductForm.reset()
})
