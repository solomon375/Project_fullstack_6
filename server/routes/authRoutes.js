const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// הנתיב להתחברות
router.post('/login', authController.login);

// הנתיב להרשמה (זה מה שהיה חסר!)
router.post('/register', authController.register);

module.exports = router;