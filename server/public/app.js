// Socket.IO server එකට connect වෙනවා
const socket = io("ws://localhost:3500");

// DOM element selection
const activity = document.querySelector(".activity");
const msgInput = document.querySelector("#messageInput");
const nameInput = document.querySelector("#nameInput");
const chatList = document.querySelector("ul");

// 🟢 Message send function
function sendMessage(e) {
    e.preventDefault(); // page reload prevent

    if (msgInput.value && nameInput.value) {
        socket.emit("message", {
            name: nameInput.value,
            text: msgInput.value
        });

        msgInput.value = "";
        msgInput.focus();
    }
}

// form submit attach
document.querySelector("form").addEventListener("submit", sendMessage);

// 🟢 Receive message from server
socket.on("message", (msg) => {
    activity.textContent = ""; // typing indicator clear

    const li = document.createElement("li");
    li.textContent = `${msg.name}: ${msg.text}`;
    chatList.appendChild(li);
});

// 🟢 Typing activity
msgInput.addEventListener('keypress', () => {
    if (nameInput.value) {
        socket.emit('activity', nameInput.value);
    }
});

// 🟢 Receive typing activity
socket.on('activity', (name) => {
    activity.textContent = `${name} is typing...`;
});
