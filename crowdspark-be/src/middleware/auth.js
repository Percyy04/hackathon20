const jwt = require("jsonwebtoken");
const { ENV } = require("../lib/env.js"); // Nơi chứa JWT_SECRET

const verifyToken = (req, res, next) => {
    // 1. Lấy token từ Header: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Cắt bỏ chữ "Bearer " để lấy token
    const token = authHeader.split(" ")[1];

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, ENV.JWT_SECRET);

        // 3. Gắn thông tin user vào request để các controller phía sau dùng
        // decoded chính là payload { userId, name, email } ta đã tạo ở generateToken
        req.user = decoded;

        next(); // Cho phép đi tiếp
    } catch (error) {
        console.error("Auth Error:", error.message);
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};

module.exports = verifyToken;
