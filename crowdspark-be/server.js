const { ENV } = require("./src/lib/env.js");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectMongoDB = require("./src/store/mongo.js");
//const socketHandler = require("./src/socket/socketHandler");

const socketService = require("./src/service/socketService.js"); // Đổi tên cho khớp với file logic
const socketAuth = require("./src/middleware/socketAuth.js");     // Middleware xác thực socket



const app = express();
app.use(cors());
app.use(express.json());

connectMongoDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.get("/", (req, res) => {
  res.send("CrowdSpark Backend is Ready! 🚀");
});


// Kích hoạt Middleware xác thực cho Socket
// (Để phân biệt User thật vs Guest)
io.use(socketAuth);

// Khởi chạy logic socket (Real-time + AI)
socketService(io);


const PORT = ENV.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
