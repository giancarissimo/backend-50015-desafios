const jwt = require('jsonwebtoken')
const configObject = require("../config/config.js")
const { secret_cookie_token } = configObject

const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.cookieAppStore

    if (token) {
        jwt.verify(token, secret_cookie_token, (err, decoded) => {
            if (err) {
                res.render('notAuthorized')
            } else {
                const userRole = decoded.user.role
                // const user = decoded.user

                if (allowedRoles.includes(userRole)) {
                    next()
                } else {
                    res.render('notAuthorized')
                }
            }
        })
    } else {
        res.render('notAuthorized')
    }
}
module.exports = checkUserRole