const express = require('express');
const { authenticate } = require('../middleware/auth');
const { commentLimiter } = require('../middleware/rateLimiter');
const commentController = require('../controllers/commentController');

const router = express.Router();

// 获取评论列表（不需要认证）
router.get('/', commentController.getCommentList);

// 以下路由需要认证
router.use(authenticate);
router.use(commentLimiter);

// 发表评论
router.post('/', commentController.createComment);

// 点赞评论
router.post('/:id/like', commentController.likeComment);

// 取消点赞
router.delete('/:id/like', commentController.unlikeComment);

// 删除评论
router.delete('/:id', commentController.deleteComment);

module.exports = router;

