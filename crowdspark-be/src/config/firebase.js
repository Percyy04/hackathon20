// src/config/firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("../../hackathon20-de134-firebase-adminsdk-fbsvc-d0e2f6f848.json"); // Đảm bảo đường dẫn đúng

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
module.exports = { db };
