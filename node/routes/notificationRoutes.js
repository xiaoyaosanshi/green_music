const express = require('express');
const { authenticate } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

// 所有路由需要认证
router.use(authenticate);

// 获取通知列表
router.get('/', notificationController.getNotificationList);

// 获取未读通知数量
router.get('/unread-count', notificationController.getUnreadCount);

// 标记通知为已读
router.put('/:id/read', notificationController.markAsRead);

// 全部标记为已读
router.put('/read-all', notificationController.markAllAsRead);

// 删除通知
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;

