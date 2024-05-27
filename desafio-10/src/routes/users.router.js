const express = require('express')
const router = express.Router()

module.exports = (userController) => {
    // Ruta POST /api/users/register-validate
    router.post('/register-validate', userController.register_validate)

    // Ruta POST /api/users/register - se utiliza passport con jwt generando un usuario y almacenandolo en MongoDB
    router.post('/register', userController.register)

    // Ruta POST /api/users/login-validate
    router.post('/login-validate', userController.login_validate)

    // Ruta POST /api/users/login - se utiliza passport con jwt para iniciar sesión
    router.post('/login', userController.login)

    // Ruta POST /api/users/logout - se utiliza passport con jwt para cerrar la sesión
    router.get('/logout', userController.logout)

    // Ruta POST /api/users/requestpasswordreset-validate
    router.post('/requestpasswordreset-validate', userController.requestPasswordReset_validate)

    // Ruta POST /api/users/requestpasswordreset - Se solicita un cambio de contraseña
    router.post('/requestpasswordreset', userController.requestPasswordReset)

    // Ruta POST /api/users/requestpasswordreset-validate
    router.post('/resetpassword-validate', userController.passwordReset_validate)

    // Ruta POST /api/users/resetpassword - Se cambia la contraseña
    router.post('/resetpassword', userController.resetPassword)

    // Ruta POST /api/users/premium/:uid - se modifica el rol del usuario
    router.post('/premium/:uid', userController.changeUserRole)

    // Ruta GET /api/users/failedregister - se renderiza la vista cuando hay un error en el registro de usuario
    // router.get('/failedregister', userController.renderFailedRegister)

    return router
}