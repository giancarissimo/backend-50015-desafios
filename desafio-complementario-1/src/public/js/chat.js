const socket = io()

const userLoginContainer = document.getElementById("userLogin_container")
const inputUserLogin = document.getElementById("userLogin")
const chatSection = document.getElementById("chat_section")
const loginBnt = document.getElementById("loginBnt")
let user

const sendMessage = () => {
    if (chatBox.value.trim().length > 0) {
        socket.emit("message", { user: user, message: chatBox.value })
        chatBox.value = ""
    }
}

inputUserLogin.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        user = inputUserLogin.value
        console.log(`El usuario es ${user}`)
        chatSection.innerHTML = `
        <div class="chat_container">
            <div id="chat">

            </div>
            <div id="chatBox_container">
                <input type="text" id="chatBox" placeholder="Text Message">
                <button type="button" id="sendMessage"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19V6M5 12l7-7 7 7" />
                </svg></button>
            </div>
        </div>
        `
        userLoginContainer.innerHTML = ""
        const chatBox = document.getElementById("chatBox")
        const sendMessageBtn = document.getElementById("sendMessage")
        chatBox.addEventListener("input", function () { sendMessageBtn.style.opacity = chatBox.value.length >= 1 ? 1 : 0; })
        chatBox.addEventListener("keyup", (event) => { if (event.key === "Enter") { sendMessage() } })
        sendMessageBtn.addEventListener("click", () => { sendMessage() })
    }
})

//Listener de Mensajes:
socket.on("message", data => {
    let chat = document.getElementById("chat")
    let messages = ""
    let lastUser = ""
    let lastString = "last"
    let separator = ""
    let chatRoomDiv = ``

    data.forEach(message => {
        separator = ""
        if (lastUser === message.user) {
            messages = messages.substring(0, messages.lastIndexOf(lastString)) + messages.substring(messages.lastIndexOf(lastString) + lastString.length)
        } else if ((lastUser === "")) {
            separator = ""
        } else if (lastUser !== message.user) {
            separator = '<div class="separator"></div>'
        }
        if (message.user === user) {
            messages = messages + `
            <div class="mine messages">
                <div class="message last">
                    ${message.user} <br>
                        ${message.message}
                </div>
            </div>
            `
        } else {
            messages = messages + separator + `
            <div class="yours messages">
                <div class="message last">
                    ${message.user} <br>
                        ${message.message}
                </div>
            </div>
            `
        }
        lastUser = message.user
    })
    chat.innerHTML = chatRoomDiv + messages
})