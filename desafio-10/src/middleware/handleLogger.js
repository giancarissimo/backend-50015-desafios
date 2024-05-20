const logger = require("../utils/logger.js")

const handleLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(`Method ${req.method} in ${req.url} - ${new Date().toLocaleDateString()}`)
    next()
}

module.exports = handleLogger