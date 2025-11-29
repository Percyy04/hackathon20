const express = require('express');
const router = express.Router();
const { createRoomAPI, getMyRooms } = require('../controllers/roomController');
const verifyToken = require('../middleware/auth');

// POST /api/rooms/create
router.post('/create', verifyToken, createRoomAPI);

// GET /api/rooms/my-rooms (Lấy lịch sử câu hỏi của tôi)
router.get('/my-rooms', verifyToken, getMyRooms);

module.exports = router;
