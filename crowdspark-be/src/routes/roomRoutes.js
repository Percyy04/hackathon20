const express = require('express');
const router = express.Router();
const { createRoomAPI, getMyRooms } = require('../controllers/roomController');
const { submitResponse, getAllResponses } = require('../controllers/responseController');
const { summarizeRoom } = require('../controllers/aiController'); // <--- Import Mới
const verifyToken = require('../middleware/auth');


// Route cũ (Cần Auth)
router.post('/create', verifyToken, createRoomAPI);
router.get('/my-rooms', verifyToken, getMyRooms);

// Route Guest trả lời (Không Auth)
router.post('/answer', submitResponse);

// --- ROUTE MỚI: Lấy danh sách câu trả lời (Không Auth) ---
// GET /api/rooms/123456/responses
router.get('/:roomId/responses', getAllResponses);

router.post('/:roomId/summarize', verifyToken, summarizeRoom);


module.exports = router;
