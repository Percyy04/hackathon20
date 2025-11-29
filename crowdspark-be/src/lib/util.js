const jwt = require("jsonwebtoken");
const { ENV } = require("./env.js");

const generateToken = (user, res) => {
  // 1. Tạo payload gọn nhẹ, đúng chuẩn
  const payload = {
    userId: user.id,      // Quan trọng: Phải khớp với socketAuth
    name: user.username,  // Quan trọng
    email: user.email
  };

  const token = jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN || "7d",
  });

  // 2. Set Cookie (Dành cho REST API)
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "strict",
    // secure: ENV.NODE_ENV === "production" // Nên bật nếu deploy https
  });

  return token;
};

// Sửa export thành object để dễ mở rộng sau này
module.exports = { generateToken };
