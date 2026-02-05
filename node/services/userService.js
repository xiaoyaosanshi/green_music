const bcrypt = require('bcrypt');
const db = require('../config/database');
const { ERROR_CODES } = require('../utils/constants');

class UserService {
  /**
   * 获取用户信息
   */
  async getUserInfo(userId) {
    const [users] = await db.query(
      `SELECT id, username, email, nickname, avatar, gender, birthday, created_at 
       FROM users WHERE id = ? AND status = 1`,
      [userId]
    );
    
    if (users.length === 0) {
      throw new Error('用户不存在');
    }
    
    return users[0];
  }

  /**
   * 更新用户信息
   */
  async updateUser(userId, data) {
    const allowedFields = ['nickname', 'avatar', 'gender', 'birthday'];
    const updateFields = [];
    const values = [];
    
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        values.push(data[field]);
      }
    });
    
    if (updateFields.length === 0) {
      throw new Error('没有可更新的字段');
    }
    
    values.push(userId);
    
    await db.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );
    
    return await this.getUserInfo(userId);
  }

  /**
   * 修改密码
   */
  async changePassword(userId, oldPassword, newPassword) {
    const [users] = await db.query(
      `SELECT password_hash FROM users WHERE id = ?`,
      [userId]
    );
    
    if (users.length === 0) {
      throw new Error('用户不存在');
    }
    
    // 验证旧密码
    const isValid = await bcrypt.compare(oldPassword, users[0].password_hash);
    if (!isValid) {
      throw new Error('原密码错误');
    }
    
    // 加密新密码
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    await db.query(
      `UPDATE users SET password_hash = ? WHERE id = ?`,
      [newPasswordHash, userId]
    );
  }

  /**
   * 获取播放历史
   */
  async getPlayHistory(userId, page = 1, pageSize = 20) {
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 20;
    const offset = (pageNum - 1) * pageSizeNum;
    const limit = pageSizeNum;
    
    const [rows] = await db.query(
      `SELECT ph.*, s.id as song_id, s.title, s.cover_url, s.duration,
              a.id as artist_id, a.name as artist_name
       FROM play_history ph
       INNER JOIN songs s ON ph.song_id = s.id
       INNER JOIN artists a ON s.artist_id = a.id
       WHERE ph.user_id = ?
       ORDER BY ph.played_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(userId), limit, offset]
    );
    
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM play_history WHERE user_id = ?`,
      [userId]
    );
    
    return {
      list: rows,
      total: countRows[0].total
    };
  }

  /**
   * 清空播放历史
   */
  async clearPlayHistory(userId) {
    await db.query(
      `DELETE FROM play_history WHERE user_id = ?`,
      [userId]
    );
  }
}

module.exports = new UserService();

