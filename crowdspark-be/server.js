const { ENV } = require("./src/lib/env.js");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectMongoDB = require("./src/store/mongo.js");
//const socketHandler = require("./src/socket/socketHandler");

const app = express();
app.use(cors());

connectMongoDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Khởi động luồng Socket
//socketHandler(io);

const PORT = ENV.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
