const express = require('express');
const { authenticate } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

// 所有路由需要认证
router.use(authenticate);

// 获取当前用户信息
router.get('/', userController.getCurrentUser);

// 更新用户信息
router.patch('/', userController.updateUser);

// 修改密码
router.put('/password', userController.changePassword);

// 获取播放历史
router.get('/play-history', userController.getPlayHistory);

// 清空播放历史
router.delete('/play-history', userController.clearPlayHistory);

module.exports = router;

