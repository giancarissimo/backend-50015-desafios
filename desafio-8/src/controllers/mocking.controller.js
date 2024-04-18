const MokingUtils = require("../utils/mocking.js")
const mokingUitls = new MokingUtils()

class MockingController {
    async generateProducts(req, res) {
        // Se genera un array de productos
        const products = []

        for (let i = 0; i < 100; i++) {
            const productsMock = await mokingUitls.generateProduct()
            products.push(productsMock)
        }
        res.json(products)
    }
}

module.exports = MockingController