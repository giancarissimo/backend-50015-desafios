// function getOrder(cartId) {
//     fetch(`/api/carts/${cartId}/purchase`, {
//         method: 'POST'
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Error getting the purchase.')
//             }
//         })
//         .then(data => {
//             window.location.href = ``
//         })
//         .catch(error => {
//             console.error('Error:', error)
//         })
// }