import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" 
            ? "*" 
            : ["http://localhost:5500"],
    }
});

io.on("connection", (socket) => {
    console.log(`✅ User ${socket.id} connected`);

    socket.on("message", (data) => {
        console.log("📩 From client:", data);
        // emit back to same client
        socket.emit("message", `You said: ${data}`);
    });

    socket.on("disconnect", () => {
        console.log(`❌ User ${socket.id} disconnected`);
    });
});

httpServer.listen(3500, () => {
    console.log("✅ WebSocket server running on ws://localhost:3500");
});
