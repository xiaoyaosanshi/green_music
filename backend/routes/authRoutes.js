const express = require('express');
const { loginLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../middleware/validator');

const router = express.Router();

// 用户注册
router.post('/register', validateRegister, authController.register);

// 用户登录
router.post('/login', loginLimiter, validateLogin, authController.login);

module.exports = router;

