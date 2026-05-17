const notificationService = require('../services/notificationService');
const ResponseHelper = require('../utils/response');

class NotificationController {
  /**
   * 获取通知列表
   */
  async getNotificationList(req, res, next) {
    try {
      const { page = 1, pageSize = 20, isRead } = req.query;
      const result = await notificationService.getNotificationList(
        req.user.userId,
        page,
        pageSize,
        isRead
      );
      return ResponseHelper.pagination(res, result.list, result.total, page, pageSize);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取未读通知数量
   */
  async getUnreadCount(req, res, next) {
    try {
      const count = await notificationService.getUnreadCount(req.user.userId);
      return ResponseHelper.success(res, { count });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 标记通知为已读
   */
  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      await notificationService.markAsRead(req.user.userId, id);
      return ResponseHelper.success(res, null, '标记成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 全部标记为已读
   */
  async markAllAsRead(req, res, next) {
    try {
      await notificationService.markAllAsRead(req.user.userId);
      return ResponseHelper.success(res, null, '全部标记成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除通知
   */
  async deleteNotification(req, res, next) {
    try {
      const { id } = req.params;
      await notificationService.deleteNotification(req.user.userId, id);
      return ResponseHelper.success(res, null, '删除成功');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();

