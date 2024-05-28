import ProductModel from "../models/products.model.js"
import ProductServices from '../services/productServices.js'
import CustomError from '../services/errors/customError.js'
import ErrorsInfo from '../services/errors/errorsInfo.js'
import { errorsCode } from "../services/errors/errorsCode.js"
import logger from "../utils/logger.js"

const productServices = new ProductServices()
const customError = new CustomError()
const errorsInfo = new ErrorsInfo()

class ProductController {
    async getProducts(req, res) {
        try {
            let { limit, page, sort, query: filterQuery } = req.query

            // se convierten a números los valores de limit y page
            limit = parseInt(limit) || 10 // Si no se especifica limit, por defecto será 10
            page = parseInt(page) || 1 // Si no se especifica page, por defecto será 1

            // Objeto para opciones de ordenamiento
            let sortOptions = {}
            if (sort) {
                sortOptions.price = (sort === 'asc') ? 1 : -1 // Se Ordena por precio ascendente o descendente según el valor de 'sort'
            }

            // Objeto para opciones de filtrado
            const filterOptions = {}
            if (filterQuery) {
                filterOptions.category = filterQuery // Se Filtra por categoría si se proporciona el parámetro 'query'
            }

            const productsList = await ProductModel.paginate(filterOptions, { limit, page, sort: sortOptions })

            const productsFinalResult = productsList.docs.map(product => {
                const { id, ...rest } = product.toObject()
                return rest
            })

            // Se construyen los enlaces de previo y siguiente
            const prevLink = productsList.hasPrevPage ? `/api/products?limit=${limit}&page=${productsList.prevPage}&sort=${sort}&query=${filterQuery}` : null
            const nextLink = productsList.hasNextPage ? `/api/products?limit=${limit}&page=${productsList.nextPage}&sort=${sort}&query=${filterQuery}` : null

            // Se construye el objeto de respuesta según el formato requerido
            const response = {
                status: 'success',
                payload: productsFinalResult,
                totalDocs: productsList.totalDocs,
                totalPages: productsList.totalPages,
                prevPage: productsList.prevPage,
                nextPage: productsList.nextPage,
                page: productsList.page,
                hasPrevPage: productsList.hasPrevPage,
                hasNextPage: productsList.hasNextPage,
                prevLink,
                nextLink
            }
            // Se envia la respuesta
            res.json(response)
        } catch (error) {
            logger.error("Error getting the products", error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }

    async getProductById(req, res, next) {
        try {
            const productId = req.params.pid
            const product = await productServices.getProductById(productId)

            if (!product) {
                return res.status(404).json({ message: `A product with the id ${productId} was not found` })
            }

            res.json({ message: "Product found:", product })
        } catch (error) {
            logger.error("Error getting the product by id.")
            next(error)
        }
    }

    async addProduct(req, res) {
        try {
            const newProduct = req.body
            const requiredFields = ["title", "description", "category", "price", "code", "stock", "status"]
            const missingFields = requiredFields.filter(field => !(field in newProduct) || (typeof newProduct[field] === "string" && newProduct[field].trim() === ""))

            if (missingFields.length > 0) {
                return res.status(400).json({ message: "All fields are mandatory." })
            }

            const products = await productServices.getProducts()
            const existingProduct = products.find(product => product.code === newProduct.code)

            if (existingProduct) {
                return res.status(400).json({ message: "A product with that code already exists." })
            }

            await productServices.addProduct(newProduct)
            res.status(200).json({ message: "Product added successfully:", newProduct })
        } catch (error) {
            logger.error("Error adding the product.")
            res.status(500).json({ error: `Internal Server Error.` })
        }
    }

    async updateProduct(req, res, next) {
        try {
            const productId = req.params.pid
            const updatedProduct = req.body

            // Se verifica si el producto existe en el array de productos
            const productIdToVerify = await productServices.getProductById(productId)
            if (!productIdToVerify) {
                customError.createError({
                    name: "Id not found",
                    cause: errorsInfo.productIdNotFound({ productId }),
                    message: "Error getting the product",
                    code: errorsCode.BAD_REQUEST
                })
            }

            await productServices.updateProduct(productId, updatedProduct)
            return res.json({ message: "Product updated successfully:", updatedProduct })
        } catch (error) {
            logger.error("Error updating the product.")
            next(error)
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const productId = req.params.pid

            // Se verifica si el producto existe en el array de productos
            const productIdToVerify = await productServices.getProductById(productId)
            if (!productIdToVerify) {
                customError.createError({
                    name: "Id not found",
                    cause: errorsInfo.productIdNotFound({ productId }),
                    message: "Error getting the product",
                    code: errorsCode.BAD_REQUEST
                })
            }

            const productToDelete = await productServices.deleteProduct(productId)
            return res.json({ message: "Product deleted successfully:", productToDelete })
        } catch (error) {
            logger.error("Error deleting the product.")
            next(error)
        }
    }
}
export default ProductController