const express = require('express');
const router = express.Router();
const pengumumanController = require('../controllers/pengumumanController');

// Route untuk membuat pengumuman
router.post('/buat', pengumumanController.createAnnouncement);

module.exports = router;
