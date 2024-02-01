let isHeaderActive = false

const handleThemes = () => {
    const lightModeBtn = document.getElementById('themeChanger_light')
    const darkModeBtn = document.getElementById('themeChanger_dark')
    const autoModeBtn = document.getElementById('themeChanger_auto')

    // Obtener el estado actual del tema desde el localStorage
    const currentTheme = localStorage.getItem('theme') || 'auto'
    setTheme(currentTheme)

    // Asignar manejadores de eventos
    lightModeBtn.addEventListener('click', () => setTheme('light'))
    darkModeBtn.addEventListener('click', () => setTheme('dark'))
    autoModeBtn.addEventListener('click', () => setTheme('auto'))

    function setTheme(theme) {
        // Guardar el tema actual en el localStorage
        localStorage.setItem('theme', theme)

        // Aplicar el tema
        if (theme === 'auto') {
            // Configurar el tema automáticamente según las preferencias del sistema/navegador
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
            document.documentElement.setAttribute('data-theme', prefersDarkMode ? 'dark' : 'light')
            autoModeBtn.classList.add('selected')
            lightModeBtn.classList.remove('selected')
            darkModeBtn.classList.remove('selected')
        } else {
            document.documentElement.setAttribute('data-theme', theme)
            autoModeBtn.classList.remove('selected')
            lightModeBtn.classList.toggle('selected', theme === 'light')
            darkModeBtn.classList.toggle('selected', theme === 'dark')
        }
    }
}

handleThemes()

// Se agrega el evento para que aparezca el header
const animatedDiv = document.getElementById("headerPage_container")
const threshold = 380
const pageTitle = document.title
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY

    if (scrollY >= threshold) {
        document.getElementById("headerPage_container").innerHTML = `
            <div class="headerPage">
                <h3 class="headerPage_title">${pageTitle}</h3>
                <div class="headerPage_buttons">
                    <a href="#header_global"><button class="goUp_btn" type="button" id="headerPage_goUpbtn">Go Up</button></a>
                    <div class="themeChanger_container" >
                        <button class="themeChanger" id="themeChanger_light" type="button">Light</button>
                        <button class="themeChanger" id="themeChanger_dark" type="button">Dark</button>
                        <button class="themeChanger" id="themeChanger_auto" type="button">Auto</button>
                    </div>
                </div>
            </div>
        `

        // ${pageTitle === "Real Time Products" ? '<a href="#scrolledToForm"><button class="goForm_btn" type="button" id="headerPage_goFormbtn">Go Form</button></a>' : ""}

        // Se agrega el evento para que desplace smooth hasta el header
        document.getElementById("headerPage_goUpbtn").addEventListener("click", (event) => {
            event.preventDefault()
            // Desplazamiento suave hacia el formulario
            document.getElementById("header_global").scrollIntoView({ behavior: 'smooth' })
        })

        handleThemes()

        animatedDiv.classList.add("active")
        animatedDiv.classList.remove("inactive")
        isHeaderActive = true
    } else {
        animatedDiv.classList.add("inactive")
        isHeaderActive = false
        setTimeout(() => {
            animatedDiv.classList.remove("active")
            document.getElementById("headerPage_container").innerHTML = `
            `
        }, 45)
    }
})