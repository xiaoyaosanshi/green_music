const db = require('../config/database');

class NotificationService {
  /**
   * 获取通知列表
   */
  async getNotificationList(userId, page = 1, pageSize = 20, isRead) {
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 20;
    const offset = (pageNum - 1) * pageSizeNum;
    const limit = pageSizeNum;
    const conditions = ['n.user_id = ?'];
    const params = [parseInt(userId)];
    
    if (isRead !== undefined) {
      conditions.push('n.is_read = ?');
      params.push(parseInt(isRead) ? 1 : 0);
    }
    
    params.push(limit, offset);
    
    const [rows] = await db.query(
      `SELECT n.*, u.id as sender_id, u.username as sender_username, u.avatar as sender_avatar
       FROM notifications n
       LEFT JOIN users u ON n.sender_id = u.id
       WHERE ${conditions.join(' AND ')}
       ORDER BY n.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );
    
    const countParams = params.length > 2 ? params.slice(0, -2) : [];
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM notifications n WHERE ${conditions.join(' AND ')}`,
      countParams
    );
    
    // 获取未读数量
    const [unreadRows] = await db.query(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0`,
      [parseInt(userId)]
    );
    
    return {
      list: rows,
      total: countRows[0].total,
      unreadCount: unreadRows[0].count
    };
  }

  /**
   * 获取未读通知数量
   */
  async getUnreadCount(userId) {
    const [rows] = await db.query(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0`,
      [userId]
    );
    
    return rows[0].count;
  }

  /**
   * 标记通知为已读
   */
  async markAsRead(userId, notificationId) {
    await db.query(
      `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`,
      [notificationId, userId]
    );
  }

  /**
   * 全部标记为已读
   */
  async markAllAsRead(userId) {
    await db.query(
      `UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0`,
      [userId]
    );
  }

  /**
   * 删除通知
   */
  async deleteNotification(userId, notificationId) {
    await db.query(
      `DELETE FROM notifications WHERE id = ? AND user_id = ?`,
      [notificationId, userId]
    );
  }
}

module.exports = new NotificationService();

