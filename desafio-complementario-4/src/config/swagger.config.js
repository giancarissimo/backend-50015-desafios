const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const swaggerOptions = {
    definition : {
        openapi: '3.0.1',
        info: {
            title: 'iStore App Documentation',
            description: 'Website project that simulates being the official Apple page'
        }
    },
    apis: ['./src/docs/**/*.yaml']
}

const specs = swaggerJsDoc(swaggerOptions)
module.exports = { swaggerUi, specs }