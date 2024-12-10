const express = require('express');
const router = express.Router();
const { tambahKegiatan } = require('../controllers/kegiatanController');

router.post('/tambah', tambahKegiatan);

module.exports = router;
