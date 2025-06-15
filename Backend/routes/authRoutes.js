const express = require('express');
const router = express.Router();
const { signup, verifyEmail, login } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/login', login);

module.exports = router;