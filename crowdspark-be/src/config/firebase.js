// src/config/firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json"); // Đảm bảo đường dẫn đúng

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
module.exports = { db };
