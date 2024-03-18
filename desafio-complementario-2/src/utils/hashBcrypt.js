const bcrypt = require("bcrypt")

// Se aplica el hasheo a la contraseña
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// Se comparan las contraseñas, retorna true o falsete segun corresponda.
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

module.exports = {
    createHash,
    isValidPassword
}