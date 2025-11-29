const express = require('express');
const router = express.Router();
const { createRoomAPI } = require('../controllers/roomController');
const verifyToken = require('../middleware/auth'); // Middleware check token HTTP

// POST /api/rooms/create
// Phải có Token mới được gọi
router.post('/create', verifyToken, createRoomAPI);

module.exports = router;
