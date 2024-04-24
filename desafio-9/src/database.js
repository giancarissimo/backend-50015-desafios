const mongoose = require("mongoose")
const configObject = require("./config/config.js")
const { mongo_url } = configObject
const logger = require("./utils/logger.js")

class DataBase {
    static #instance

    constructor() {
        mongoose.connect(mongo_url)
    }
    static getIntance() {
        if (this.#instance) {
            logger.info("Database connection already exists.")
            return this.#instance
        }
        this.#instance = new DataBase()
        logger.info("Connection to database successful.")
        return this.#instance
    }
}

module.exports = DataBase.getIntance()