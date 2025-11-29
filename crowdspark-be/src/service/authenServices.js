const { db } = require('../config/firebase'); // Import db từ config
const bcrypt = require("bcrypt");
const { generateToken } = require("../lib/util.js");
// const admin = require("firebase-admin"); // Nếu dùng Google Login thì uncomment

// Collection name
const USER_COLL = 'users';

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Validate cơ bản
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required!" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format!" });

    // 2. Check trùng Email trong Firestore
    const userQuery = await db.collection(USER_COLL).where('email', '==', email).get();
    if (!userQuery.empty) {
      return res.status(400).json({ message: "Email is already used!" });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // 4. Tạo User mới trong Firestore
    const newUserRef = db.collection(USER_COLL).doc(); // Tự sinh ID ngẫu nhiên
    const newUserData = {
      id: newUserRef.id, // Lưu ID vào trong doc luôn cho tiện lấy
      username,
      email,
      password: hashedPass,
      createdAt: new Date().toISOString()
    };

    await newUserRef.set(newUserData);

    // Trả về thông tin (không trả password)
    return res.status(201).json({
      id: newUserRef.id,
      username,
      email
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required!" });

  try {
    // 1. Tìm user theo email
    const userQuery = await db.collection(USER_COLL).where('email', '==', email).limit(1).get();

    if (userQuery.empty) {
      return res.status(400).json({ message: "User not found!" });
    }

    // Lấy data từ doc đầu tiên tìm thấy
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // 2. So sánh password
    const correctPass = await bcrypt.compare(password, userData.password);
    if (!correctPass) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    // 3. Tạo Token JWT
    // userData đã có field `id` (do mình lưu lúc signup) -> Token sẽ chứa Firestore ID
    const token = generateToken(userData, res);

    return res.status(200).json({
      message: "Login successful",
      token: token, // Trả token cho FE lưu
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal error" });
  }
};


// --- THÊM ĐOẠN NÀY ĐỂ CHỮA CHÁY ---
const loginWithGoogle = async (req, res) => {
  return res.status(501).json({ message: "Google Login chưa hỗ trợ Firestore." });
};

const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  return res.status(200).json({ message: "Logout successfully!" });
};

// --- EXPORT ĐỦ 4 HÀM ---
module.exports = {
  signup,
  login,
  logout,
  loginWithGoogle,
};