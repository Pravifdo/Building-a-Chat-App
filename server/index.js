// ---------------------- IMPORTS ----------------------

// Express framework import කරනවා (Node.js web server build කරන්න)
import express from "express";

// Socket.io server import කරනවා (Real-time communication සඳහා)
import { Server } from "socket.io";

// File path handle කරන්න අවශ්‍ය imports
import path from "path";
import { fileURLToPath } from "url";

// ---------------------- PATH SETUP ----------------------

// __filename සහ __dirname ES Modules වල default නැති නිසා
// ඒවා manual ලෙස හදාගන්නවා
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------- PORT ----------------------

// Server එක run වෙන්න PORT එක set කරනවා
// Environment variable PORT තිබුනොත් ඒක use කරනවා
// නැත්නම් default = 3500
const PORT = process.env.PORT || 3500;

// ---------------------- EXPRESS APP ----------------------

// Express app එක create කරනවා
const app = express();

// "public" folder එක static files serve කරනවා (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Express server එක start කරනවා
const expressServer = app.listen(PORT, () => {
  console.log(`🚀 HTTP server running on port ${PORT}`);
});

// ---------------------- SOCKET.IO SERVER ----------------------

// Socket.IO server එක Express server එකට attach කරනවා
const io = new Server(expressServer, {
  cors: {
    // Production එකේදි origins allow කරන්නෙ නෑ
    origin: process.env.NODE_ENV === "production"
      ? false
      // Development එකේදි localhost වලින් connect වෙන්න ඉඩ දෙන්න
      : ["http://localhost:5500", "http://127.0.0.1:5500"],
  },
});

// ---------------------- SOCKET.IO EVENTS ----------------------

// 🟢 Client එක connect උනොත්
io.on("connection", (socket) => {
  console.log(`✅ User ${socket.id} connected`);

  // 🟢 Welcome message එක නව client එකටම යවයි
  socket.emit("message", "Welcome to the chat!");

  // 🟢 අලුත් user එක join උන බව connected වෙන අනිත් clients ට කියනවා
  socket.broadcast.emit(
    "message",
    `User ${socket.id.substring(0, 5)} has joined the chat`
  );

  // 🟢 Client එක "activity" emit කලොත් (typing indicator)
  socket.on("activity", (data) => {
    console.log("🟢 User is typing:", data);

    // අනිත් clients ට "user is typing..." කියලා කියනවා
    socket.broadcast.emit("activity", `${socket.id.substring(0, 5)} is typing...`);
  });

  // 🟢 Client එක "message" emit කලොත්
  socket.on("message", (data) => {
    console.log("📩 From client:", data);

    // සියලුම connected clients ට message එක යවයි
    io.emit("message", data);
  });

  // 🟢 Client එක disconnect උනොත්
  socket.on("disconnect", () => {
    console.log(`❌ User ${socket.id} disconnected`);

    // අනිත් clients ට කියනවා user එක left වුනා කියලා
    socket.broadcast.emit(
      "message",
      `User ${socket.id.substring(0, 5)} has left the chat`
    );
  });
});
