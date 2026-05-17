const express = require('express');
const { authenticate } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const playbackController = require('../controllers/playbackController');

const router = express.Router();

// 所有路由需要认证
router.use(authenticate);
router.use(apiLimiter);

// 上报播放事件（批量）
router.post('/events', playbackController.reportEvents);

module.exports = router;

