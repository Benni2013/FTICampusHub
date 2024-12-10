const express = require('express');
const router = express.Router();
const riwayatController = require('../controllers/riwayatController');

// Rute untuk mendapatkan riwayat kegiatan berdasarkan id pendaftaran
router.get('/:pendaftaranId', riwayatController.getRiwayatKegiatan);

module.exports = router;
