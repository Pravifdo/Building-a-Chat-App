const ws = require('ws');
const server = new ws.Server({ port: 3000 });

console.log("✅ WebSocket server running on ws://localhost:3000");

server.on('connection', socket => {
    // Send a welcome message when client connects
    socket.send("Welcome! You are connected to the server.");

    // When the server receives a message
    socket.on('message', message => {
        console.log("📩 From client:", message.toString());

        // Send the same message back
        socket.send(`You said: ${message}`);
    });
});
