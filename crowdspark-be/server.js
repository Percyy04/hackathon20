require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import CORS

// Import các module
const { db } = require('./src/config/firebase');
const authRoutes = require('./src/routes/auth.routes');
const roomRoutes = require('./src/routes/roomRoutes');
const socketAuth = require('./src/middleware/socketAuth');
const socketService = require('./src/service/socketService');

// Import AI Service
const { analyzeComments } = require('./src/service/aiService');
const { getActiveRoomIds, getAndClearBuffer } = require('./src/service/aiBufferService');

const app = express();
const server = http.createServer(app);

// --- 1. CẤU HÌNH CORS & BODY PARSER (QUAN TRỌNG NHẤT) ---
app.use(cors({ origin: "*" })); // Cho phép mọi nơi gọi API
app.use(express.json()); // Đọc được JSON từ Body (Login cần cái này)

// --- 2. CẤU HÌNH SOCKET.IO ---
const io = socketIo(server, {
  cors: {
    origin: "*", // Cho phép FE kết nối socket
    methods: ["GET", "POST"]
  }
});

// Gắn io vào app để Controller có thể dùng (cho API trả lời)
app.set('io', io);

// --- 3. ROUTES API ---
app.use("/api/auth", authRoutes); // Login/Signup
app.use("/api/rooms", roomRoutes); // Tạo phòng/Trả lời

// --- 4. SOCKET LOGIC ---
io.use(socketAuth); // Middleware xác thực token socket

io.on('connection', (socket) => {
  console.log(`✅ Socket User Connected: ${socket.user.name} (${socket.id})`);
  socketService(io, socket);
});

// --- 5. AI WORKER (CHẠY NGẦM 10s/LẦN) ---
setInterval(async () => {
  const activeRooms = getActiveRoomIds();
  if (activeRooms.length === 0) return;

  for (const roomId of activeRooms) {
    // Lấy tin nhắn từ buffer
    const batchToAnalyze = getAndClearBuffer(roomId);

    // Chỉ phân tích nếu có từ 3 tin nhắn trở lên
    if (!batchToAnalyze || batchToAnalyze.length < 3) {
      continue;
    }

    console.log(`🤖 AI Processing Room ${roomId}: ${batchToAnalyze.length} comments...`);

    try {
      const roomDoc = await db.collection('rooms').doc(roomId).get();
      const question = roomDoc.exists ? roomDoc.data().question : "General Discussion";

      // Gọi AI
      const result = await analyzeComments(question, batchToAnalyze);

      if (result) {
        console.log("✨ AI Done via Worker!");
        io.to(roomId).emit('server_update_summary', result);
      }
    } catch (e) {
      console.error(`❌ AI Worker Error Room ${roomId}:`, e.message);
    }
  }
}, 10000);

// --- 6. KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
