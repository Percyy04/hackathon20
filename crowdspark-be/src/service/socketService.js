const { db } = require('../config/firebase');
// const { analyzeComments } = require('./aiService'); // Bỏ comment khi bạn code xong AI

// Bộ đệm lưu tin nhắn tạm thời trong RAM
const aiBuffers = {};
// Cấu trúc: { "roomId_123": [ { content: "...", user: "..." }, ... ] }

module.exports = (io) => {
    io.on('connection', (socket) => {
        // Lấy thông tin User từ Middleware (Mongo ID hoặc Guest ID)
        const currentUser = socket.user;

        console.log(`🔌 User connected: ${currentUser.name} (ID: ${currentUser.id})`);

        // --- 1. TẠO PHÒNG (Chỉ User đã Login Mongo mới được tạo) ---
        socket.on('create_room', async ({ question }) => {
            // Chặn Guest tạo phòng
            if (currentUser.isGuest) {
                return socket.emit('error_msg', 'Bạn cần đăng nhập để tạo phòng!');
            }

            const roomId = Math.floor(100000 + Math.random() * 900000).toString();

            try {
                // Lưu vào Firestore
                // hostId chính là Mongo ID của bạn kia -> Link 2 DB tại đây
                await db.collection('rooms').doc(roomId).set({
                    hostId: currentUser.id,
                    hostName: currentUser.name,
                    question: question,
                    createdAt: new Date().toISOString(),
                    isActive: true
                });

                socket.join(roomId);
                socket.emit('room_created', { roomId, question });
                console.log(`✅ Room ${roomId} created by ${currentUser.name}`);
            } catch (e) {
                console.error("Create Error:", e);
                socket.emit('error_msg', 'Lỗi tạo phòng, thử lại sau.');
            }
        });

        // --- 2. JOIN ROOM (Ai cũng join được) ---
        socket.on('join_room', async (roomId) => {
            try {
                const roomDoc = await db.collection('rooms').doc(roomId).get();

                if (!roomDoc.exists) {
                    return socket.emit('error_msg', 'Phòng không tồn tại!');
                }

                socket.join(roomId);
                socket.emit('joined_success', {
                    question: roomDoc.data().question,
                    roomId
                });
                console.log(`👋 ${currentUser.name} joined room ${roomId}`);
            } catch (e) {
                console.error("Join Error:", e);
            }
        });

        // --- 3. GỬI TIN NHẮN (Lưu Firebase) ---
        socket.on('client_send_idea', async ({ roomId, content }) => {
            const msg = {
                userId: currentUser.id,      // Mongo ID hoặc Guest ID
                userName: currentUser.name,
                content: content,
                timestamp: new Date().toISOString(),
                userType: currentUser.isGuest ? 'GUEST' : 'USER'
            };

            // 1. Bắn Socket
            io.to(roomId).emit('server_broadcast_idea', msg);

            // 2. Lưu vào Firestore
            try {
                await db.collection('rooms').doc(roomId).collection('responses').add(msg);
            } catch (e) {
                console.error("Save Msg Error:", e);
            }

            // 3. (TODO) Đẩy vào AI Buffer ở đây...

            if (!aiBuffers[roomId]) {
                aiBuffers[roomId] = [];
            }
            aiBuffers[roomId].push({ content });
        });
        // Cứ 10 giây quét buffer một lần
        setInterval(async () => {
            for (const roomId in aiBuffers) {
                const buffer = aiBuffers[roomId];

                // Nếu ít hơn 3 comment thì thôi, chưa bõ công gọi AI (tiết kiệm)
                if (!buffer || buffer.length < 3) continue;

                // Copy ra để xử lý và Clear buffer ngay
                const batchToAnalyze = [...buffer];
                aiBuffers[roomId] = [];

                // Lấy câu hỏi từ DB (hoặc cache nếu có) để AI hiểu context
                try {
                    const roomDoc = await db.collection('rooms').doc(roomId).get();
                    const question = roomDoc.exists ? roomDoc.data().question : "Ý kiến chung";

                    // Gọi AI
                    const result = await analyzeComments(question, batchToAnalyze);

                    if (result) {
                        // Bắn kết quả về cho Host hiển thị
                        io.to(roomId).emit('server_update_summary', result);

                        // (Optional) Lưu kết quả AI vào Firestore luôn nếu muốn xem lại lịch sử
                        // await db.collection('rooms').doc(roomId).collection('ai_reports').add(result);
                    }
                } catch (e) {
                    console.error(`AI Worker Error Room ${roomId}:`, e.message);
                }
            }
        }, 10000);
    });
};
