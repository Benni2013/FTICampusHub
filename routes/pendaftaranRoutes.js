const express = require('express');
const router = express.Router();
const pendaftaranController = require('../controllers/pendaftaranController');

// Route untuk membuat pendaftaran
router.post('/daftar', pendaftaranController.createRegistration);

// Route untuk menyeleksi pendaftaran (diterima atau ditolak)
router.post('/seleksi', pendaftaranController.selectRegistration);

module.exports = router;
