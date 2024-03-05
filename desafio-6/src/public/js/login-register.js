const inputErrors = document.querySelectorAll('.input_error')
const inputs = document.querySelectorAll('.input')
const placeholders = document.querySelectorAll('.input_placeholder')
const iconError = document.querySelectorAll('.input_iconError')
const pageTitle = document.title
const passwordInput = document.getElementById('password')
const showPasswordCheckbox = document.getElementById('showPasswordCheckbox')

// Función para mostrar/ocultar la contraseña en el input
showPasswordCheckbox.addEventListener('change', function() {
    if (this.checked) {
        passwordInput.type = 'text'
    } else {
        passwordInput.type = 'password'
    }
})

// Función para manejar los estilos de error de un input específico
const handleInputsError = (input) => {
    input.style.border = '.1rem solid var(--clr-red)'
    input.nextElementSibling.style.color = 'var(--clr-red)'
    input.nextElementSibling.nextElementSibling.innerHTML = '<img src="../assets/images/png/ios-exclamation-mark-icon.png" alt="iOs exclamation mark icon">'
}

// -------------------- Login Page --------------------

const loginErrors = [
    'Email address and password are required',
    'Email address is required',
    'Password is required',
    'The email address or password are incorrect',
    'User not found',
]

if (pageTitle === 'Login') {
    // Se itera sobre los errores y aplican estilos de error a los campos correspondientes
    loginErrors.forEach(error => {
        inputErrors.forEach(inputError => {
            const errorText = inputError.innerText
            if (errorText === error) {
                handleInputsError(inputError.parentElement.querySelector('.input'))
            }
        })
    })
}

// -------------------- Register Page --------------------

const registerErrors = [
    'Username is required',
    'First name is required',
    'Last name is required',
    'Email address is required',
    'Password is required',
    'Age is required',
    'The username is already registered',
    'The email address is already registered',
    'Password must be at least 8 characters long',
    'You must be at least 18 years old to register'
]

if (pageTitle === 'Register') {
    // Se itera sobre los errores y se aplican estilos de error a los campos correspondientes
    registerErrors.forEach(error => {
        inputErrors.forEach(inputError => {
            const errorText = inputError.innerText
            if (errorText === error) {
                handleInputsError(inputError.parentElement.querySelector('.input'))
            }
        })
    })
}