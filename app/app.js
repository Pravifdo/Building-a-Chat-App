const socket = io("ws://localhost:3500");

// 🟢 Form submit event
function sendMessage(e) {
    e.preventDefault();

    const nameField = document.querySelector("#nameInput");
    const msgField = document.querySelector("#messageInput");

    if (nameField.value && msgField.value) {
        // Emit object with name + message
        socket.emit("message", { name: nameField.value, text: msgField.value });
        msgField.value = ""; // clear only message field
    }
    msgField.focus();
}

document.querySelector("form").addEventListener("submit", sendMessage);

// 🟢 Listen for messages from server
socket.on("message", (msg) => {
    const li = document.createElement("li");
    li.textContent = `${msg.name}: ${msg.text}`;
    document.querySelector("ul").appendChild(li);
});
