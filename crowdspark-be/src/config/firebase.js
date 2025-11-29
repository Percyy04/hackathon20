const admin = require("firebase-admin");

// Kiểm tra: Nếu có biến môi trường thì dùng biến đó, không thì dùng file (local)
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
    serviceAccount = require("../../hackathon20-de134-firebase-adminsdk-fbsvc-d0e2f6f848.json");
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();
module.exports = { db };
