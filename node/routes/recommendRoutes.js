const express = require('express');
const { authenticate } = require('../middleware/auth');
const recommendController = require('../controllers/recommendController');

const router = express.Router();

// 获取个性化推荐（需要认证）
router.get('/personal', authenticate, recommendController.getPersonalRecommend);

// 获取热门推荐（不需要认证）
router.get('/hot', recommendController.getHotRecommend);

// 获取相似推荐（不需要认证）
router.get('/similar/:songId', recommendController.getSimilarRecommend);

module.exports = router;

