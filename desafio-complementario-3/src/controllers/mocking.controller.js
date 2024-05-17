const MockingUtils = require("../utils/mocking.js")
const mockingUitls = new MockingUtils()

class MockingController {
    async generateProducts(req, res) {
        // Se genera un array de productos
        const products = []

        for (let i = 0; i < 100; i++) {
            const productsMock = await mockingUitls.generateProduct()
            products.push(productsMock)
        }
        res.json(products)
    }
}

module.exports = MockingController