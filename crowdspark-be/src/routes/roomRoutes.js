const express = require('express');
const router = express.Router();
const { createRoomAPI, getMyRooms } = require('../controllers/roomController');
const { submitResponse } = require('../controllers/responseController'); // <--- Import Controller Mới
const verifyToken = require('../middleware/auth');

// Các route cũ (Cần Auth)
router.post('/create', verifyToken, createRoomAPI);
router.get('/my-rooms', verifyToken, getMyRooms);

// --- ROUTE MỚI (Không cần Auth - Cho Guest) ---
router.post('/answer', submitResponse);

module.exports = router;
