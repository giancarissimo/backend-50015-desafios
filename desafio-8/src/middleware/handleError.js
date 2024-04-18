const { errorsCode } = require("../services/errors/errorsCode.js")

const handleError = (error, req, res, next) => {
    console.log(error.cause)
    switch (error.code) {
        case errorsCode.PATH_ERROR:
            res.send({ status: "error", error: error.name })
            break
        case errorsCode.TYPE_INVALID:
            res.send({ status: "error", error: error.name })
            break
        case errorsCode.DB_ERROR:
            res.send({ status: "error", error: error.name })
            break
        default:
            res.send({ status: "error", error: "unknown error" })
    }
}

module.exports = handleError