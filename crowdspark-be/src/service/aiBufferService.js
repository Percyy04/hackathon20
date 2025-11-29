// File này dùng để lưu trữ tạm thời tin nhắn chờ AI xử lý
// Giúp chia sẻ dữ liệu giữa Socket và API Controller

const aiBuffers = {};

// Hàm thêm tin nhắn vào hàng đợi
const addToBuffer = (roomId, content) => {
    if (!aiBuffers[roomId]) {
        aiBuffers[roomId] = [];
    }
    aiBuffers[roomId].push({ content });
};

// Hàm lấy và clear buffer (dùng cho Worker)
const getAndClearBuffer = (roomId) => {
    if (!aiBuffers[roomId]) return [];
    const data = [...aiBuffers[roomId]];
    aiBuffers[roomId] = []; // Xóa sau khi lấy
    return data;
};

// Lấy danh sách các phòng đang có data
const getActiveRoomIds = () => Object.keys(aiBuffers);

module.exports = {
    addToBuffer,
    getAndClearBuffer,
    getActiveRoomIds
};
