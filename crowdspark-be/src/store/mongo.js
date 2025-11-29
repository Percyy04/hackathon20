const mongoose = require("mongoose");
const { db } = require('../config/firebase'); // Import db để check

const { ENV } = require("../lib/env");

async function checkFirestoreConnection() {
  try {
    // Thử đọc một collection bất kỳ (VD: collection 'health_check')
    // Limit 1 để tốn ít quota nhất có thể
    await db.collection('health_check').limit(1).get();
    console.log("🔥 Firestore: Connected & Ready!");
  } catch (error) {
    console.error("❌ Firestore Connection Failed:", error.message);
    console.error("👉 Tip: Check file serviceAccountKey.json or Internet connection.");
    // process.exit(1); // Nếu muốn server tắt luôn khi lỗi DB thì bỏ comment dòng này
  }
}

module.exports = checkFirestoreConnection;
