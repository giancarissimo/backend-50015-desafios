// Login Page y Register Page
const bodyHtml = document.body
const pageName = document.title
const inputs = document.querySelectorAll('.input')
const inputErrors = document.querySelectorAll('.input_error')
const placeholders = document.querySelectorAll('.input_placeholder')
const showPasswordIcon = document.querySelector('#showPasswordIcon')
const errorImg = `<img src="../assets/images/png/ios-exclamation-mark-icon.png" alt="Exclamation Mark Icon">`

// Login Page
const loginForm = document.querySelector('#loginForm')
const emailInputLogin = document.getElementById('email')
const emailErrorsLogin = document.getElementById('errors_email')
const passwordInputLogin = document.getElementById('password')
const passwordErrorsLogin = document.getElementById('errors_password')

// Register Page
const registerForm = document.querySelector('#registerForm')
const inputUsername = document.querySelector('#username')
const errorsUsername = document.querySelector('#errors_username')
const inputFirstName = document.querySelector('#first_name')
const errorsFirstName = document.querySelector('#errors_first_name')
const inputLastName = document.querySelector('#last_name')
const errorsLastName = document.querySelector('#errors_last_name')
const inputEmail = document.querySelector('#email')
const errorsEmail = document.querySelector('#errors_email')
const inputPassword = document.querySelector('#password')
const errorsPassword = document.querySelector('#errors_password')
const inputAge = document.querySelector('#age')
const errorsAge = document.querySelector('#errors_age')

// Cambiar el color del 'Body'
if (pageName === 'Login' || pageName === 'Register') {
    bodyHtml.style.backgroundColor = 'var(--clr-white)'
}

// Función para mostrar/ocultar la contraseña en el input
let passwordVisible = false

showPasswordIcon.addEventListener('click', () => {
    passwordVisible = !passwordVisible

    if (passwordVisible) {
        passwordInputLogin.type = 'text'
        showPasswordIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M 8.073 12.194 L 4.212 8.333 c -1.52 1.657 -2.096 3.317 -2.106 3.351 L 2 12 l 0.105 0.316 C 2.127 12.383 4.421 19 12.054 19 c 0.929 0 1.775 -0.102 2.552 -0.273 l -2.746 -2.746 a 3.987 3.987 0 0 1 -3.787 -3.787 Z M 12.054 5 c -1.855 0 -3.375 0.404 -4.642 0.998 L 3.707 2.293 L 2.293 3.707 l 18 18 l 1.414 -1.414 l -3.298 -3.298 c 2.638 -1.953 3.579 -4.637 3.593 -4.679 l 0.105 -0.316 l -0.105 -0.316 C 21.98 11.617 19.687 5 12.054 5 Z m 1.906 7.546 c 0.187 -0.677 0.028 -1.439 -0.492 -1.96 s -1.283 -0.679 -1.96 -0.492 L 10 8.586 A 3.955 3.955 0 0 1 12.054 8 c 2.206 0 4 1.794 4 4 a 3.94 3.94 0 0 1 -0.587 2.053 l -1.507 -1.507 Z" /></svg>'
    } else {
        passwordInputLogin.type = 'password'
        showPasswordIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M 12 5 c -7.633 0 -9.927 6.617 -9.948 6.684 L 1.946 12 l 0.105 0.316 C 2.073 12.383 4.367 19 12 19 s 9.927 -6.617 9.948 -6.684 l 0.106 -0.316 l -0.105 -0.316 C 21.927 11.617 19.633 5 12 5 Z m 0 11 c -2.206 0 -4 -1.794 -4 -4 s 1.794 -4 4 -4 s 4 1.794 4 4 s -1.794 4 -4 4 Z" /><path d="M 12 10 c -1.084 0 -2 0.916 -2 2 s 0.916 2 2 2 s 2 -0.916 2 -2 s -0.916 -2 -2 -2 Z" /></svg>'
    }
})

// Función para manejar los estilos de error de un input específico
const handleInputsErrorStyle = (input, hasErrors) => {
    if (hasErrors) {
        input.classList.add('input-red')
        input.nextElementSibling.classList.add('placeholder-red')
        if (input.nextElementSibling.nextElementSibling) {
            input.nextElementSibling.nextElementSibling.classList.add('show_password_icon-red')
        }
    } else {
        input.classList.remove('input-red')
        input.nextElementSibling.classList.remove('placeholder-red')
        if (input.nextElementSibling.nextElementSibling) {
            input.nextElementSibling.nextElementSibling.classList.remove('show_password_icon-red')
        }
    }
}

// -------------------- Login Page --------------------

if (pageName === 'Login') {
    loginForm.addEventListener('submit', () => { validateLoginForm(event) })
}

async function validateLoginForm(event) {
    // Se evita que el formulario se envíe automáticamente
    event.preventDefault()

    // Se coloca un objeto de requerimiento de inputs
    const inputsRequired = {
        email: `${errorImg} Email address is required`,
        password: `${errorImg} Password is required`
    }

    // Se valida si hay un campo vacío
    !emailInputLogin.value.length > 0 ? (emailErrorsLogin.innerHTML = inputsRequired.email, handleInputsErrorStyle(emailInputLogin, true)) : (emailErrorsLogin.innerText = "", handleInputsErrorStyle(emailInputLogin, false))
    !passwordInputLogin.value.length > 0 ? (passwordErrorsLogin.innerHTML = inputsRequired.password, handleInputsErrorStyle(passwordInputLogin, true)) : (passwordErrorsLogin.innerText = "", handleInputsErrorStyle(passwordInputLogin, false))

    // Se realizan consultas al back para los campos 'email' y 'password'
    async function validateField(emailData, passwordData) {
        try {
            if (!emailData || !passwordData) {
                return null
            }

            const response = await fetch('/api/sessions/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: emailData, password: passwordData }),
            })

            const result = await response.json()

            if (result.errors !== null && result.errors.email) {
                emailErrorsLogin.innerHTML = errorImg + result.errors.email
                handleInputsErrorStyle(emailInputLogin, true)
                passwordErrorsLogin.innerHTML = errorImg + result.errors.password
                handleInputsErrorStyle(passwordInputLogin, true)
            }

            return result.errors
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    try {
        const emailData = emailInputLogin.value
        const passwordData = passwordInputLogin.value
        await validateField(emailData, passwordData)
    } catch (error) {
        console.error('An error ocurred:', error)
    }

    // Si no hay errores, se envía el formulario. De lo contrario, no se envía
    if (emailErrorsLogin.innerHTML.length === 0 && passwordErrorsLogin.innerHTML.length === 0) {
        loginForm.submit()
    } else {
        return false
    }
}

// -------------------- Register Page --------------------

if (pageName === 'Register') {
    registerForm.addEventListener('submit', () => { validateForm(event) })
}

async function validateForm(event) {
    // Se evita que el formulario se envíe automáticamente
    event.preventDefault()

    // Se define la expresión regular para validar que solo haya letras y espacios en el nombre y apellido
    const regexNameAndSurname = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/

    // Se coloca un objeto de requerimiento de inputs
    const inputsRequired = {
        username: `${errorImg} Username is required`,
        first_name: `${errorImg} First name is required`,
        last_name: `${errorImg} Last name is required`,
        email: `${errorImg} Email address is required`,
        password: `${errorImg} Password is required`,
        age: `${errorImg} Age is required`
    }

    // Se coloca un objeto de errores de inputs
    const inputsError = {
        first_name: `${errorImg} Not a valid first name`,
        last_name: `${errorImg} Not a valid last name`,
        password: `${errorImg} Password must be at least 8 characters long`,
        age: `${errorImg} You must be at least 18 years old to register`
    }

    // Se valida si hay un campo vacío
    !inputUsername.value.length > 0 ? (errorsUsername.innerHTML = inputsRequired.username, handleInputsErrorStyle(inputUsername, true)) : (errorsUsername.innerText = "", handleInputsErrorStyle(inputUsername, false))
    !inputEmail.value.length > 0 ? (errorsEmail.innerHTML = inputsRequired.email, handleInputsErrorStyle(inputEmail, true)) : (errorsEmail.innerText = "", handleInputsErrorStyle(inputEmail, false))

    // Se valida el campo del nombre
    inputFirstName.value.length > 0 ? (!regexNameAndSurname.test(inputFirstName.value) ? (errorsFirstName.innerHTML = inputsError.first_name, handleInputsErrorStyle(inputFirstName, true)) : (errorsFirstName.innerHTML = '', handleInputsErrorStyle(inputFirstName, false))) : (errorsFirstName.innerHTML = inputsRequired.first_name, handleInputsErrorStyle(inputFirstName, true))

    // Se valida el campo del apellido
    inputLastName.value.length > 0 ? (!regexNameAndSurname.test(inputLastName.value) ? (errorsLastName.innerHTML = inputsError.last_name, handleInputsErrorStyle(inputLastName, true)) : (errorsLastName.innerHTML = '', handleInputsErrorStyle(inputLastName, false))) : (errorsLastName.innerHTML = inputsRequired.last_name, handleInputsErrorStyle(inputLastName, true))

    // Se valida la longitud de la contraseña
    inputPassword.value.length > 0 ? (inputPassword.value.length < 8 ? (errorsPassword.innerHTML = inputsError.password, handleInputsErrorStyle(inputPassword, true)) : (errorsPassword.innerHTML = '', handleInputsErrorStyle(inputPassword, false))) : (errorsPassword.innerHTML = inputsRequired.password, handleInputsErrorStyle(inputPassword, true))

    // Se valida la edad mínima
    inputAge.value.length > 0 ? (inputAge.value < 18 ? (errorsAge.innerHTML = inputsError.age, handleInputsErrorStyle(inputAge, true)) : (errorsAge.innerHTML = '', handleInputsErrorStyle(inputAge, false))) : (errorsAge.innerHTML = inputsRequired.age, handleInputsErrorStyle(inputAge, true))


    // Se realizan consultas al back para los campos 'username' y 'email'
    async function validateField(field, value, errorsElement, errorType, input) {
        try {
            if (!value) {
                return null
            }

            const response = await fetch('/api/users', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [field]: value }),
            })

            const result = await response.json()

            if (result.errors !== null && result.errors[errorType]) {
                errorsElement.innerHTML = errorImg + result.errors[errorType]
                handleInputsErrorStyle(input, true)
            }
            return result.errors
        } catch (error) {
            console.error(`Error fetching data for ${field}:`, error)
        }
    }

    try {
        await validateField("username", inputUsername.value, errorsUsername, "username", inputUsername)
        await validateField("email", inputEmail.value, errorsEmail, "email", inputEmail)
    } catch (error) {
        console.error('An error ocurred:', error)
    }

    // Si no hay errores, se envía el formulario. De lo contrario, no se envía
    if (errorsUsername.innerHTML.length === 0 && errorsFirstName.innerHTML.length === 0 && errorsLastName.innerHTML.length === 0 && errorsEmail.innerHTML.length === 0 && errorsPassword.innerHTML.length === 0 && errorsAge.innerHTML.length === 0) {
        registerForm.submit()
    } else {
        return false
    }
}