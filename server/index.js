// Node.js built-in HTTP module එක import කරනවා
import { createServer } from "http";

// socket.io server import කරනවා
import { Server } from "socket.io";

// HTTP server එකක් create කරනවා (මූලික server එක)
const httpServer = createServer();

// Socket.io server එක initialize කරනවා (httpServer එකට connect කරලා)
const io = new Server(httpServer, {
    cors: { 
        // 🟢 Production environment එකේදි (deploy කල පසු) 
        // Origin allow කරන්නෙ නෑ (false).
        origin: process.env.NODE_ENV === "production" 
            ? false 
            // 🟢 Development එකේදි localhost:5500, 127.0.0.1:5500 
            // වලින් frontend run වෙන්න ඉඩ දෙන්න.
            : ["http://localhost:5500", "http://127.0.0.1:5500"],
    }
});

// 🟢 Client එක server එකට connect උනාම මේ function එක trigger වෙනවා
io.on("connection", (socket) => {
    console.log(`✅ User ${socket.id} connected`);

    // 🟢 Server එක client එකෙන් එන "message" event එක listen කරනවා
    socket.on("message", (data) => {
        console.log("📩 From client:", data);

        // ---------------------- IMPORTANT ----------------------
        // socket.emit("msg")      → sender ට (එක browser එකටම) යවයි
        // socket.broadcast.emit() → sender හැර අනිත් clients ට යවයි
        // io.emit("msg")          → සෑම connected client එකකටම යවයි ✅
        // -------------------------------------------------------

        // 🟢 මේකෙන් එක browser එකක් msg යවද්දි 
        //    connected වෙලා තියෙන සියලුම browsers වල print වෙනවා
        io.emit("message", data);
    });

    // 🟢 Client එක disconnect උනාම trigger වෙනවා
    socket.on("disconnect", () => {
        console.log(`❌ User ${socket.id} disconnected`);
    });
});

// 🟢 Server එක 3500 port එකේ run වෙනවා
httpServer.listen(3500, () => {
    console.log("✅ WebSocket server running on ws://localhost:3500");
});
