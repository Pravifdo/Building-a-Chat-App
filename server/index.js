// Node.js built-in HTTP module එක import කරන්න අවශ්‍ය නෑ, 
// Express එකෙන්ම server එක create කරනවා
import express from "express";

// socket.io server import කරනවා
import { Server } from "socket.io";

// File path handle කරන්න path, fileURLToPath import කරනවා
import path from "path";
import { fileURLToPath } from "url";

// __filename සහ __dirname ES module වල use කරන්න
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Port එක define කරනවා (Environment variable PORT use කරලා, 
// නෑනම් default = 3500)
const PORT = process.env.PORT || 3500;

// Express app එක create කරනවා
const app = express();

// "public" folder එක static files serve කරනවා (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Express server එක start කරනවා
const expressServer = app.listen(PORT, () => {
  console.log(`🚀 HTTP server running on port ${PORT}`);
});

// Socket.io server එක initialize කරනවා (Express server එකට attach කරලා)
const io = new Server(expressServer, {
  cors: {
    // 🟢 Production environment එකේදි (Deploy කල පසු) 
    // Origins allow කරන්නෙ නෑ (false)
    origin: process.env.NODE_ENV === "production"
      ? false
      // 🟢 Development එකේදි localhost වලින් connect වෙන්න ඉඩ දෙන්න
      : ["http://localhost:5500", "http://127.0.0.1:5500"],
  },
});

// 🟢 Client එක server එකට connect උනාම trigger වෙනවා
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

    // 🟢 එක client එකක් msg යවද්දි connected වෙලා තියෙන 
    //    සියලුම clients ට emit කරනවා
    io.emit("message", data);
  });

  // 🟢 Client එක disconnect උනාම trigger වෙනවා
  socket.on("disconnect", () => {
    console.log(`❌ User ${socket.id} disconnected`);
  });
});
