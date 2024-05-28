import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'

import jwt from 'passport-jwt'
const { Strategy: JWTStrategy, ExtractJwt } = jwt

// Traemos las funcionalidades del Carrito
import CartServices from '../services/cartServices.js'
const cartServices = new CartServices()

// Traemos el UserModel y las funciones de bcrypt
import UserModel from '../models/user.model.js'
import GithubUserModel from '../models/githubUser.model.js'

// Traemos las variables de entorno
import configObject from '../config/config.js'
const { secret_cookie_token, github_client_id, github_client_secret, github_callback_url } = configObject

const initializePassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: secret_cookie_token,
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
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
    passport.use('github', new GitHubStrategy({
        clientID: github_client_id,
        clientSecret: github_client_secret,
        callbackURL: github_callback_url
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('Profile: ', profile)
        try {
            let user = await GithubUserModel.findOne({ email: profile._json.email })

            let nameComponents = profile._json.name.split(' ')
            let firstName = nameComponents[0]
            let lastName = nameComponents.length > 1 ? nameComponents[nameComponents.length - 1] : ''

            if (!user) {
                const newCart = await cartServices.createCart()
                let newUser = {
                    username: profile._json.login,
                    first_name: firstName,
                    last_name: lastName,
                    email: profile._json.email,
                    password: '',
                    age: '',
                    role,
                    cart: newCart._id
                }
                let result = await GithubUserModel.create(newUser)
                done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))
}

const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['cookieAppStore']
    }
    return token
}

export default initializePassport