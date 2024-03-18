const passport = require("passport")
const local = require("passport-local")
const GitHubStrategy = require("passport-github2")

// Traemos las funcionalidades del Carrito
const CartManager = require('../dao/db/cartManager-db')
const cartManager = new CartManager()

// Traemos el UserModel y las funciones de bcrypt
const UserModel = require("../dao/models/user.model.js")
const GithubserModel = require("../dao/models/githubUser.model.js")
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js")
const LocalStrategy = local.Strategy

const initializePassport = () => {
    // Se agrega una estrategia para el "register"
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "username"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body
        try {
            // Verificamos si ya existe un registro con ese mail
            let user = await UserModel.findOne({ email })
            if (user) {
                return done(null, false)
            }

            const newCart = await cartManager.createCart()

            // Si no existe, voy a crear un registro de usuario nuevo
            let newUser = {
                username,
                first_name,
                last_name,
                email,
                password: createHash(password),
                age,
                role,
                cart: newCart._id
            }

            let result = await UserModel.create(newUser)
            // Si todo resulta bien, podemos mandar done con el usuario generado.
            return done(null, result)
        } catch (error) {
            return done(error)
        }
    }))

    // Se Agrega una estrategia para el "login"
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            // Se verifica si existe un usuario con ese mail.
            const user = await UserModel.findOne({ email })
            if (!user) {
                console.log("User not found")
                return done(null, false)
            }
            // Se verifica si la contraseña es válida
            if (!isValidPassword(password, user)) {
                console.log("Invalid password")
                return done(null, false)
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id })
        done(null, user)
    })

    // Se agrega una estrategia para el login con GitHub
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.3e45c82bd65499d9",
        clientSecret: "a09a057f768ea9b51f2a27aa903b65aa9a718603",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("Profile: ", profile)
        try {
            let user = await GithubserModel.findOne({ email: profile._json.email })

            let nameComponents = profile._json.name.split(" ")
            let firstName = nameComponents[0]
            let lastName = nameComponents.length > 1 ? nameComponents[nameComponents.length - 1] : ""

            if (!user) {
                const newCart = await cartManager.createCart()
                let newUser = {
                    username: profile._json.login,
                    first_name: firstName,
                    last_name: lastName,
                    email: profile._json.email,
                    password: "",
                    age: "",
                    role: "user",
                    cart: newCart._id
                }
                let result = await GithubserModel.create(newUser)
                done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))
}

module.exports = initializePassport