const { db } = require('../config/firebase');
const { analyzeComments } = require('../service/aiService'); // Hàm gọi Groq đã có sẵn

const summarizeRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.userId; // Host ID (để check quyền nếu cần)

        if (!roomId) return res.status(400).json({ message: "Thiếu Room ID" });

        // 1. Lấy thông tin phòng (để lấy câu hỏi gốc)
        const roomRef = db.collection('rooms').doc(roomId);
        const roomDoc = await roomRef.get();

        if (!roomDoc.exists) {
            return res.status(404).json({ message: "Phòng không tồn tại" });
        }

        const roomData = roomDoc.data();
        // (Optional) Check xem người gọi API có phải là Host không
        if (roomData.hostId !== userId) {
            return res.status(403).json({ message: "Bạn không phải chủ phòng này!" });
        }

        // 2. Lấy toàn bộ câu trả lời trong sub-collection 'responses'
        const responsesSnap = await roomRef.collection('responses').get();

        if (responsesSnap.empty) {
            return res.status(400).json({ message: "Chưa có câu trả lời nào để phân tích!" });
        }

        // Chuyển data thành mảng text
        const answers = [];
        responsesSnap.forEach(doc => {
            const data = doc.data();
            if (data.content) answers.push({ content: data.content });
        });

        // 3. Gọi Groq AI (Hàm này bạn đã viết trong aiService.js)
        console.log(`🤖 Đang gửi ${answers.length} câu trả lời sang Groq...`);
        const aiResult = await analyzeComments(roomData.question, answers);

        if (!aiResult) {
            return res.status(500).json({ message: "AI không phản hồi hoặc lỗi JSON" });
        }

        // 4. Lưu kết quả vào Firestore (Để lần sau load lại không phải gọi AI nữa)
        // Lưu vào sub-collection 'ai_reports' hoặc update thẳng vào doc room tùy bạn
        // Ở đây mình lưu đè vào document room luôn cho tiện lấy
        await roomRef.update({
            lastSummary: aiResult, // Lưu object kết quả
            lastSummaryAt: new Date().toISOString()
        });

        // 5. Trả kết quả về cho Frontend hiển thị ngay
        return res.status(200).json({
            message: "Phân tích thành công",
            data: aiResult
        });

    } catch (error) {
        console.error("AI Summarize Error:", error);
        return res.status(500).json({ message: "Lỗi Server khi gọi AI" });
    }
};

module.exports = { summarizeRoom };
