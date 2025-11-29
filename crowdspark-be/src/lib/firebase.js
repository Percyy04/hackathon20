const admin = require("firebase-admin");
require("dotenv").config(); // Load .env nếu có

let serviceAccount;

// 1. ƯU TIÊN: Kiểm tra biến môi trường trên Render trước
// Bạn cần tạo biến ENV tên là: FIREBASE_SERVICE_ACCOUNT
// Giá trị là nội dung file JSON đã được ép thành 1 dòng (minify)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("✅ Loaded Firebase config from ENV");
  } catch (error) {
    console.error("❌ Error parsing FIREBASE_SERVICE_ACCOUNT from ENV:", error.message);
  }
}
// 2. FALLBACK: Nếu không có ENV thì tìm file JSON local
else {
  try {
    // Đường dẫn tới file của bạn
    serviceAccount = require("../../hackathon20-de134-firebase-adminsdk-fbsvc-d0e2f6f848.json");
    console.log("✅ Loaded Firebase config from Local JSON file");
  } catch (error) {
    console.error("⚠️ Could not load Firebase credentials (ENV or Local File missing).");
  }
}

// 3. Khởi tạo Firebase Admin
if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Export cả admin và db cho tiện dùng
module.exports = { admin, db };
