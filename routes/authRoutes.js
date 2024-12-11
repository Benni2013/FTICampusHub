const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.post('/change-password', authController.changePassword);

module.exports = router;
