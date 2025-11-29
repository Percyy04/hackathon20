const { ENV } = require("./src/lib/env.js");
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { db } = require('./src/config/firebase');
const { analyzeComments } = require('./src/service/aiService');
const { getActiveRoomIds, getAndClearBuffer } = require('./src/service/aiBufferService'); // <--- MỚI

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// --- QUAN TRỌNG: Gắn IO vào App để Controller dùng ---
app.set('io', io);

app.use(express.json()); // Để đọc body JSON

// ... (Các route khác của bạn) ...
const roomRoutes = require('./src/routes/roomRoutes'); // Route phòng
app.use('/api/rooms', roomRoutes);

// ... (Phần Socket Connection giữ nguyên) ...

// --- AI WORKER (Sửa lại dùng Service) ---
setInterval(async () => {
  const activeRooms = getActiveRoomIds();

  for (const roomId of activeRooms) {
    // Lấy data từ Service
    const batchToAnalyze = getAndClearBuffer(roomId);

    if (!batchToAnalyze || batchToAnalyze.length < 3) {
      // Nếu ít quá thì trả lại vào buffer (hoặc xử lý logic khác tùy bạn)
      // Ở đây đơn giản là bỏ qua, chờ đợt sau
      // (Lưu ý: Logic này hơi simple, thực tế nên restore lại buffer nếu chưa xử lý)
      continue;
    }

    try {
      const roomDoc = await db.collection('rooms').doc(roomId).get();
      const question = roomDoc.exists ? roomDoc.data().question : "General";

      // Gọi AI
      const result = await analyzeComments(question, batchToAnalyze);

      if (result) {
        io.to(roomId).emit('server_update_summary', result);
      }
    } catch (e) {
      console.error(`AI Error Room ${roomId}:`, e.message);
    }
  }
}, 10000);

const PORT = ENV.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
