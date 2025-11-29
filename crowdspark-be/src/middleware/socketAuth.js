const jwt = require('jsonwebtoken');

module.exports = (socket, next) => {
    const token = socket.handshake.auth.token;

    if (token) {
        // Trường hợp 1: Có Token (User đã login)
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
            socket.user = {
                id: decoded.userId, // Mongo ID
                name: decoded.name,
                isGuest: false
            };
            return next();
        } catch (err) {
            // Token sai thì thôi, cho làm Guest luôn hoặc báo lỗi tùy bạn
            // Ở đây mình cho làm Guest cho dễ tính
        }
    }

    // Trường hợp 2: Không có Token (Khách vãng lai)
    socket.user = {
        id: `guest_${socket.id}`, // ID tạm
        name: socket.handshake.auth.guestName || `Guest #${socket.id.substr(0, 4)}`,
        isGuest: true
    };
    next();
};
