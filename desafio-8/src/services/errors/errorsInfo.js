class ErrorsInfo {
    productIdNotFound(productId) {
        return `A product with the id ${productId} was not found.`
    }
}

module.exports = ErrorsInfo