const express = require('express');
const router = express.Router();
const { tambahKegiatan, lihatKegiatan } = require('../controllers/kegiatanController');

router.post('/tambah', tambahKegiatan);

router.get('/:kegiatan_id', lihatKegiatan);

module.exports = router;
