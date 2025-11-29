const { db } = require('../config/firebase');
const { generateRoomQR } = require('../service/qrService');

const createRoomAPI = async (req, res) => {
    try {
        const { question } = req.body;
        // Lấy user từ middleware auth (req.user do middleware gắn vào)
        const user = req.user;

        if (!question) {
            return res.status(400).json({ message: "Thiếu câu hỏi (question)" });
        }

        // Logic tạo phòng y hệt bên Socket
        const roomId = Math.floor(100000 + Math.random() * 900000).toString();
        const qrCodeImage = await generateRoomQR(roomId);

        await db.collection('rooms').doc(roomId).set({
            hostId: user.userId, // Lấy từ token decoded
            hostName: user.name,
            question: question,
            qrCode: qrCodeImage,
            createdAt: new Date().toISOString(),
            isActive: true
        });

        // Trả về JSON cho Client
        return res.status(201).json({
            message: "Tạo phòng thành công",
            roomId,
            question,
            qrCode: qrCodeImage,
            joinUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/join/${roomId}`
        });

    } catch (error) {
        console.error("API Create Room Error:", error);
        return res.status(500).json({ message: "Lỗi Server" });
    }
};

const getMyRooms = async (req, res) => {
    try {
        const userId = req.user.userId; // Lấy ID từ Token

        // Query Firestore: Tìm tất cả phòng do user này làm Host
        // Sắp xếp theo thời gian tạo mới nhất trước (desc)
        const roomsRef = db.collection('rooms');
        const snapshot = await roomsRef
            .where('hostId', '==', userId)
            // .orderBy('createdAt', 'desc') // Cần tạo Composite Index trên Firebase mới chạy được sort
            .get();

        if (snapshot.empty) {
            return res.status(200).json([]); // Trả về mảng rỗng nếu chưa tạo gì
        }

        const rooms = [];
        snapshot.forEach(doc => {
            rooms.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sắp xếp thủ công bằng JS (để đỡ phải tạo Index trên Firebase lúc demo gấp)
        rooms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.status(200).json(rooms);

    } catch (error) {
        console.error("Get My Rooms Error:", error);
        return res.status(500).json({ message: "Lỗi lấy danh sách phòng" });
    }
};

module.exports = {
    createRoomAPI,
    getMyRooms // <--- Nhớ export thêm hàm này
};
