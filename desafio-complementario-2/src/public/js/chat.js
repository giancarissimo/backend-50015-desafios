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

chatSection.style.display = "none"

inputUserLogin.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        user = inputUserLogin.value
        console.log(`El usuario es ${user}`)
        document.getElementById("headerPage_container").style.display = 'none'
        document.getElementById("header_global").style.display = 'none'
        chatSection.innerHTML = `
        <aside class="chat_users">
            <div class="chat_settings_container">
                <div class="themeChanger_container" >
                    <button class="themeChanger" id="themeChanger_light" type="button">Light</button>
                    <button class="themeChanger" id="themeChanger_dark" type="button">Dark</button>
                    <button class="themeChanger" id="themeChanger_auto" type="button">Auto</button>
                </div>
                <button type="button" class="icon_text">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="12px" height="13px" viewBox="0 0 12 13" version="1.1">
                    <g id="Design-Spec" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Taxonomy-and-Icons-Filled---04/28/22" transform="translate(-45.000000, -448.000000)" fill="#86868B" fill-rule="nonzero">
                            <g id="􀈎" transform="translate(45.097656, 448.581094)">
                                <path d="M1.83984375,11.5732031 L8.71875,11.5732031 C9.24609375,11.5732031 9.65527344,11.4218359 9.94628906,11.1191016 C10.2373047,10.8163672 10.3828125,10.3622656 10.3828125,9.75679688 L10.3828125,3.493125 L9.43945312,4.43648438 L9.43945312,9.70992188 C9.43945312,10.0146094 9.3671875,10.2441016 9.22265625,10.3983984 C9.078125,10.5526953 8.90625,10.6298438 8.70703125,10.6298438 L1.85742188,10.6298438 C1.56445312,10.6298438 1.33886719,10.5526953 1.18066406,10.3983984 C1.02246094,10.2441016 0.943359375,10.0146094 0.943359375,9.70992188 L0.943359375,3.05953125 C0.943359375,2.75484375 1.02246094,2.524375 1.18066406,2.368125 C1.33886719,2.211875 1.56445312,2.13375 1.85742188,2.13375 L7.1953125,2.13375 L8.13867188,1.19039063 L1.83984375,1.19039063 C1.23046875,1.19039063 0.771484375,1.34175781 0.462890625,1.64449219 C0.154296875,1.94722656 0,2.40132813 0,3.00679688 L0,9.75679688 C0,10.3622656 0.154296875,10.8163672 0.462890625,11.1191016 C0.771484375,11.4218359 1.23046875,11.5732031 1.83984375,11.5732031 Z M3.97265625,7.77632813 L5.11523438,7.27828125 L10.5878906,1.81148438 L9.78515625,1.02046875 L4.31835938,6.48726563 L3.79101563,7.58882813 C3.76757813,7.63960938 3.77832031,7.68941406 3.82324219,7.73824219 C3.86816406,7.78707031 3.91796875,7.79976563 3.97265625,7.77632813 Z M11.0214844,1.38375 L11.4433594,0.95015625 C11.5410156,0.8446875 11.5908203,0.728476563 11.5927734,0.601523438 C11.5947266,0.474570313 11.5449219,0.362265625 11.4433594,0.264609375 L11.3085938,0.123984375 C11.21875,0.034140625 11.1103516,-0.006875 10.9833984,0.0009375 C10.8564453,0.00875 10.7441406,0.05953125 10.6464844,0.15328125 L10.21875,0.57515625 L11.0214844,1.38375 Z" id="Shape"/>
                            </g>
                        </g>
                    </g>
                    </svg>
                </button>
            </div>
            <div class="user">
                <img src="../assets/images/png/ios-contact-photo-icon.png">
                <h3>${user} <span>(You)</span></h3>
            </div>
        </aside>
        <div class="chat_container">
            <div id="chat">
                <div class="chat_title">
                    <h4><span>To:</span> Community Chat</h4>
                    <span id="logOut_btn">Log Out</span>
                </div>
            </div>
            <div id="chatBox_container">
                <button class="filesBtn" type="button"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="14px" height="11px" viewBox="0 0 14 11" version="1.1">
                <g id="Design-Spec" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Taxonomy-and-Icons-Filled---04/28/22" transform="translate(-1505.000000, -373.000000)" fill="#86868B">
                        <path d="M1515.39901,379.565965 C1515.30454,379.646104 1515.19618,379.686174 1515.07399,379.686174 L1514.46061,379.686174 L1514.89063,380.427555 C1514.95065,380.53442 1514.96951,380.649634 1514.9473,380.773197 C1514.92505,380.896761 1514.85614,380.990766 1514.7406,381.055362 C1514.6228,381.122157 1514.5056,381.134383 1514.38891,381.092114 C1514.27226,381.049808 1514.18501,380.975223 1514.12722,380.868358 L1512.57712,378.186749 C1512.48596,378.033143 1512.43152,377.855644 1512.41377,377.654103 C1512.39595,377.452636 1512.41318,377.262874 1512.46542,377.084741 C1512.51762,376.906646 1512.6038,376.771974 1512.7238,376.680653 L1513.95391,378.804567 L1515.07399,378.804567 C1515.19618,378.804567 1515.30454,378.845196 1515.39901,378.926453 C1515.49344,379.007748 1515.5407,379.115135 1515.5407,379.248725 C1515.5407,379.380116 1515.49344,379.485825 1515.39901,379.565965 L1515.39901,379.565965 Z M1512.79275,379.692281 L1508.92299,379.692281 C1508.80291,379.692281 1508.69556,379.6521 1508.60106,379.571738 C1508.50652,379.491375 1508.4593,379.385372 1508.4593,379.253615 C1508.4593,379.119653 1508.50652,379.011968 1508.60106,378.930447 C1508.69556,378.848964 1508.80291,378.808222 1508.92299,378.808222 L1510.05054,378.808222 L1511.5017,376.293296 L1511.06136,375.543161 C1511.0013,375.435999 1510.98183,375.321025 1511.00298,375.198239 C1511.02409,375.075491 1511.09137,374.980551 1511.20479,374.913608 C1511.32267,374.844421 1511.44,374.83104 1511.55673,374.873389 C1511.6735,374.91585 1511.76078,374.990606 1511.81865,375.097768 L1512.0021,375.402509 L1512.18891,375.097768 C1512.24674,374.990606 1512.33405,374.916411 1512.45078,374.875071 C1512.56755,374.833806 1512.68484,374.846627 1512.80273,374.913608 C1512.91615,374.978383 1512.98455,375.07265 1513.00789,375.196557 C1513.03124,375.320465 1513.01177,375.435999 1512.94951,375.543161 L1511.07469,378.808222 L1512.14888,378.808222 C1512.32679,378.808222 1512.46858,378.85457 1512.57422,378.947192 C1512.67982,379.039852 1512.75105,379.154826 1512.78772,379.292114 C1512.82444,379.429403 1512.82608,379.562842 1512.79275,379.692281 L1512.79275,379.692281 Z M1509.85356,380.870639 C1509.79589,380.976522 1509.70834,381.050423 1509.59089,381.09234 C1509.47339,381.134221 1509.3559,381.122107 1509.23844,381.055926 C1509.1254,380.989744 1509.05834,380.895974 1509.0373,380.774691 C1509.01622,380.653333 1509.03563,380.539768 1509.09549,380.433885 L1509.34154,380.016963 C1509.49002,379.975082 1509.62466,379.966256 1509.74549,379.990483 C1509.86629,380.014784 1509.96712,380.054522 1510.04806,380.109624 C1510.12896,380.164763 1510.18273,380.218795 1510.2093,380.271755 L1509.85356,380.870639 Z M1518.76404,376.789134 C1518.53564,376.035573 1518.1507,375.415391 1517.73216,374.935863 C1517.22134,374.350602 1516.60085,373.860702 1515.7013,373.502315 C1515.23761,373.3176 1514.65344,373.214964 1514.19958,373.142846 C1513.6321,373.052671 1512.95715,373.017862 1512,373.017862 C1511.04285,373.017862 1510.36786,373.052671 1509.80038,373.142846 C1509.34652,373.214964 1508.76236,373.3176 1508.2987,373.502315 C1507.39915,373.860702 1506.77866,374.350602 1506.2678,374.935863 C1505.84926,375.415391 1505.46436,376.035573 1505.23596,376.789134 C1505.09615,377.250455 1505,377.785424 1505,378.267862 C1505,378.750263 1505.09615,379.285232 1505.23596,379.746554 C1505.46436,380.500114 1505.84926,381.120296 1506.2678,381.599824 C1506.77866,382.185085 1507.39915,382.674985 1508.2987,383.033372 C1508.76236,383.218087 1509.34652,383.320723 1509.80038,383.392841 C1510.36786,383.483016 1511.04285,383.517862 1512,383.517862 C1512.95715,383.517862 1513.6321,383.483016 1514.19958,383.392841 C1514.65344,383.320723 1515.23761,383.218087 1515.7013,383.033372 C1516.60085,382.674985 1517.22134,382.185085 1517.73216,381.599824 C1518.1507,381.120296 1518.53564,380.500114 1518.76404,379.746554 C1518.90385,379.285232 1519,378.750263 1519,378.267862 C1519,377.785424 1518.90385,377.250455 1518.76404,376.789134 L1518.76404,376.789134 Z" id="iMessage-App-Icon" style="mix-blend-mode: multiply;"/>
                    </g>
                </g>
            </svg></button>
                <input type="text" id="chatBox" placeholder="Text Message">
                <button class="emoji-btn" type"button"><img src="../assets/images/png/ios-select-emoji-icon.png" alt="Select Emoji"></button>
            </div>
        </div>
        `
        handleThemes()
        chatSection.style.display = "flex"
        userLoginContainer.innerHTML = ""
        const chatBox = document.getElementById("chatBox")
        chatBox.addEventListener("keyup", (event) => { if (event.key === "Enter") { sendMessage() } })
    }
})

//Listener de Mensajes:
socket.on("message", data => {
    let chat = document.getElementById("chat")
    let messages = ""
    let lastUser = ""
    let lastString = "last"
    let separator = ""
    let chatRoomDiv = `
    <div class="chat_title">
        <h4><span>To:</span> Community Chat</h4>
        <span id="logOut_btn">Log Out</span>
    </div>
    `

    data.forEach(message => {
        separator = ""
        if (lastUser === message.user) {
            messages = messages.substring(0, messages.lastIndexOf(lastString)) + messages.substring(messages.lastIndexOf(lastString) + lastString.length)
        } else if ((lastUser === "")) {
            separator = ""
        } else if (lastUser !== message.user) {
            separator = '<div class="separator"></div>'
        }
        if (lastUser !== message.user) {
            if (message.user === user) {
                messages = messages + `
                <div class="mine messages">
                    <div class="message last">
                        <p>${message.message}</p>
                    </div>
                </div>
                `
            } else {
                messages = messages + separator + `
                <div class="yours messages">
                    <span>${message.user}</span>
                    <div class="message last">
                        <p>${message.message}</p>
                    </div>
                </div>
                `
            }
        } else {
            if (message.user === user) {
                messages = messages + `
                <div class="mine messages">
                    <div class="message last">
                        <p>${message.message}</p>
                    </div>
                </div>
                `
            } else {
                messages = messages + separator + `
                <div class="yours messages">
                    <div class="message last">
                        <p>${message.message}</p>
                    </div>
                </div>
                `
            }
        }
        lastUser = message.user
    })
    chat.innerHTML = chatRoomDiv + messages
})