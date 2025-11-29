const QRCode = require('qrcode');
const { ENV } = require('../lib/env'); // Giả sử bạn để CLIENT_URL trong file env.js

/**
 * Tạo mã QR Code dạng Base64
 * @param {string} roomId - Mã phòng
 * @returns {Promise<string>} - Chuỗi Data URL của ảnh QR
 */
const generateRoomQR = async (roomId) => {
    // Lấy domain từ biến môi trường, fallback về IP LAN (để test mobile)
    const baseUrl = ENV.CLIENT_URL || "https://giaidieutuhao.site";

    const joinUrl = `${baseUrl}/join/${roomId}`;

    try {
        // toDataURL trả về chuỗi "data:image/png;base64,..."
        const qrImage = await QRCode.toDataURL(joinUrl, {
            width: 400, // Kích thước ảnh
            margin: 2,
            color: {
                dark: '#000000',  // Màu mã
                light: '#ffffff'  // Màu nền
            }
        });
        return qrImage;
    } catch (err) {
        console.error("QR Gen Error:", err);
        return null;
    }
};

module.exports = { generateRoomQR };
