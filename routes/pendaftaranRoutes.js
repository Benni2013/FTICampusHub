const express = require('express');
const router = express.Router();
const pendaftaranController = require('../controllers/pendaftaranController');

router.post('/daftar', pendaftaranController.createRegistration);

module.exports = router;
