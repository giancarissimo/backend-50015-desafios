function deleteProductInCart(cartId, productId) {
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting the product from the cart.')
            }
            location.reload()
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

function clearCart(cartId) {
    fetch(`/api/carts/${cartId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error emptying the cart.')
            }
            location.reload()
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

function prices() {
    const card = document.querySelectorAll(".cart_product")

    card.forEach(function (element, index) {
        const quantityMobile = element.querySelector('[id^="mobile-quantity-"]').textContent
        const precioMobile = element.querySelector('[id^="mobile-cartProductPrice-"]').textContent.split("$")[1]
        const quantity = element.querySelector('.cart_product_text_span').textContent
        const precio = element.querySelector('.cart_product_text_price').textContent.split("$")[1]
        element.querySelector('.cart_product_text_price').textContent = "$" + precio * quantity
        element.querySelector('[id^="mobile-cartProductPrice-"]').textContent = "$" + precioMobile * quantityMobile
    })
}
prices()

function addOne(product, price, cart, stock, quantity) {
    const spanquantity = document.querySelector(`#quantity-${product}`).textContent
    const spanquantityMobile = document.querySelector(`#mobile-quantity-${product}`).textContent
    if ((Number(spanquantity) + 1) > 1 || (Number(spanquantityMobile) + 1) > 1) {
        document.querySelector(`#less-quantity-${product}`).disabled = false
    }
    if (Number(spanquantity) + 1 == stock || Number(spanquantityMobile) + 1 == stock) {
        document.querySelector(`#more-quantity-${product}`).disabled = true
    } if (Number(spanquantity) < stock || Number(spanquantityMobile) < stock) {
        document.querySelector(`#quantity-${product}`).textContent = Number(spanquantity) + 1
        document.querySelector(`#cartProductPrice-${product}`).textContent = "$" + (Number(spanquantity) + 1) * price
        document.querySelector(`#mobile-quantity-${product}`).textContent = Number(spanquantityMobile) + 1
        document.querySelector(`#mobile-cartProductPrice-${product}`).textContent = "$" + (Number(spanquantityMobile) + 1) * price
        const card = document.querySelectorAll(".cart_product")
        let quantityheader= 0
        card.forEach(function (element, index) {
            const quantity = element.querySelector('.cart_product_text_span').textContent
            quantityheader = quantityheader+Number(quantity)
        })
        document.getElementById(`header_icons_bag_notification`).textContent = quantityheader
        const precios = document.querySelectorAll(".cart_product_text_price")
        let preciototal = 0
        for (let y = 0; y < precios.length; y++) {
            preciototal = preciototal + Number(precios[y].textContent.split("$")[1])
        }
        document.querySelector(`#totalPurchase`).textContent = "$" + preciototal
        document.querySelector(`#subTotalPurchase`).textContent = "$" + preciototal
        fetch(`/api/carts/${cart}/product/${product}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantitySpeed: (Number(spanquantity) + 1) })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud')
                }
                return response.json()
            })
            .then(data => {})
            .catch(error => {
                console.error('Error:', error) // Manejo de errores
            })
    }
}

function removeOne(product, price, cart, stock, quantity) {
    const spanquantity = document.getElementById(`quantity-${product}`).textContent
    const spanquantityMobile = document.querySelector(`#mobile-quantity-${product}`).textContent
    if ((Number(spanquantity) - 1) < stock || (Number(spanquantityMobile) - 1) < stock) {
        document.getElementById(`more-quantity-${product}`).disabled = false
    }
    if ((Number(spanquantity) - 1) == 1 || (Number(spanquantityMobile) - 1) == 1) {
        document.getElementById(`less-quantity-${product}`).disabled = true
    } if (spanquantity > 1 || spanquantityMobile > 1) {
        document.getElementById(`quantity-${product}`).textContent = Number(spanquantity) - 1
        document.getElementById(`cartProductPrice-${product}`).textContent = "$" + (Number(spanquantity) - 1) * price
        document.getElementById(`mobile-quantity-${product}`).textContent = Number(spanquantity) - 1
        document.getElementById(`mobile-cartProductPrice-${product}`).textContent = "$" + (Number(spanquantity) - 1) * price
        const card = document.querySelectorAll(".cart_product")
        let quantityheader= 0
        card.forEach(function (element, index) {
            const quantity = element.querySelector('.cart_product_text_span').textContent
            quantityheader = quantityheader+Number(quantity)
        })
        document.getElementById(`header_icons_bag_notification`).textContent = quantityheader
        const precios = document.querySelectorAll(".cart_product_text_price")
        let preciototal = 0
        for (let y = 0; y < precios.length; y++) {
            preciototal = preciototal + Number(precios[y].textContent.split("$")[1])
        }
        document.getElementById(`totalPurchase`).textContent = "$" + preciototal
        document.getElementById(`subTotalPurchase`).textContent = "$" + preciototal
        fetch(`/api/carts/${cart}/product/${product}/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantitySpeed: (Number(spanquantity) - 1) })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud')
                }
                return response.json()
            })
            .then(data => {})
            .catch(error => {
                console.error('Error:', error) // Manejo de errores
            })
    }
}