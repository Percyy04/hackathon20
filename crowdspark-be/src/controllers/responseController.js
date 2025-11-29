const { db } = require('../config/firebase');
const { addToBuffer } = require('../service/aiBufferService');

const submitResponse = async (req, res) => {
    try {
        const { roomId, content } = req.body;

        if (!roomId || !content) {
            return res.status(400).json({ message: "Thiếu roomId hoặc content" });
        }

        // 1. Tạo cấu trúc tin nhắn
        const msg = {
            userId: 'guest_' + Math.random().toString(36).substr(2, 9), // Fake ID Guest
            userName: 'Guest', // Hoặc lấy từ req.body.userName nếu FE gửi lên
            content: content,
            timestamp: new Date().toISOString(),
            userType: 'GUEST'
        };

        // 2. Lưu vào Firestore
        await db.collection('rooms').doc(roomId).collection('responses').add(msg);

        // 3. BROADCAST Realtime cho Host (Quan trọng!)
        // Lấy biến io đã set ở server.js
        const io = req.app.get('io');
        io.to(roomId).emit('server_broadcast_idea', msg);

        // 4. Đẩy vào AI Buffer
        addToBuffer(roomId, content);

        return res.status(200).json({ message: "Đã gửi câu trả lời", data: msg });

    } catch (error) {
        console.error("Submit Error:", error);
        return res.status(500).json({ message: "Lỗi Server" });
    }
};

module.exports = { submitResponse };
