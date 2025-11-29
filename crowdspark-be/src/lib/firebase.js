var admin = require("firebase-admin");
var serviceAccount = require("../../hackathon20-de134-firebase-adminsdk-fbsvc-d0e2f6f848.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
