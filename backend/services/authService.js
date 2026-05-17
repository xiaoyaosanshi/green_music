const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { ERROR_CODES } = require('../utils/constants');

class AuthService {
  /**
   * 用户注册
   */
  async register(username, password, email, nickname) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 1. 检查用户名和邮箱是否已存在
      const [existing] = await connection.query(
        `SELECT id FROM users WHERE username = ? OR email = ?`,
        [username, email]
      );
      
      if (existing.length > 0) {
        await connection.rollback();
        return {
          code: ERROR_CODES.CONFLICT,
          message: '用户名或邮箱已存在'
        };
      }
      
      // 2. 加密密码
      const passwordHash = await bcrypt.hash(password, 10);
      
      // 3. 插入用户
      const [result] = await connection.query(
        `INSERT INTO users (username, password_hash, email, nickname) 
         VALUES (?, ?, ?, ?)`,
        [username, passwordHash, email, nickname || username]
      );
      
      const userId = result.insertId;
      
      // 4. 初始化通知设置
      await connection.query(
        `INSERT INTO notification_settings (user_id) VALUES (?)`,
        [userId]
      );
      
      await connection.commit();
      
      return {
        code: ERROR_CODES.SUCCESS,
        message: '注册成功',
        data: { userId, username }
      };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 用户登录（含锁定机制）
   */
  async login(identity, password, ip) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 1. 检查锁定状态
      const [attempts] = await connection.query(
        `SELECT * FROM user_login_attempts 
         WHERE identity = ? AND (locked_until IS NULL OR locked_until > NOW())`,
        [identity]
      );
      
      if (attempts.length > 0 && attempts[0].locked_until) {
        await connection.rollback();
        return {
          code: ERROR_CODES.AUTH_LOCKED,
          message: '账号已锁定，请30分钟后重试',
          data: { lockedUntil: attempts[0].locked_until }
        };
      }
      
      // 2. 查找用户（支持用户名或邮箱）
      const [users] = await connection.query(
        `SELECT * FROM users 
         WHERE (username = ? OR email = ?) AND status = 1`,
        [identity, identity]
      );
      
      if (users.length === 0) {
        await this.recordLoginFailure(connection, identity, ip);
        await connection.commit();
        return {
          code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
          message: '账号或密码错误'
        };
      }
      
      const user = users[0];
      
      // 3. 验证密码
      const isValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isValid) {
        await this.recordLoginFailure(connection, identity, ip);
        await connection.commit();
        return {
          code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
          message: '账号或密码错误'
        };
      }
      
      // 4. 登录成功，清除失败记录
      await connection.query(
        `DELETE FROM user_login_attempts WHERE identity = ?`,
        [identity]
      );
      
      // 5. 更新最后登录时间
      await connection.query(
        `UPDATE users SET last_login_at = NOW() WHERE id = ?`,
        [user.id]
      );
      
      // 6. 生成 JWT Token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
      
      await connection.commit();
      
      return {
        code: ERROR_CODES.SUCCESS,
        message: '登录成功',
        data: {
          token,
          userInfo: {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            avatar: user.avatar,
            email: user.email
          }
        }
      };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  /**
   * 记录登录失败
   */
  async recordLoginFailure(connection, identity, ip) {
    const [attempts] = await connection.query(
      `SELECT * FROM user_login_attempts WHERE identity = ?`,
      [identity]
    );
    
    if (attempts.length === 0) {
      // 首次失败
      await connection.query(
        `INSERT INTO user_login_attempts (identity, ip, fail_count, last_failed_at) 
         VALUES (?, ?, 1, NOW())`,
        [identity, ip]
      );
    } else {
      const attempt = attempts[0];
      const newFailCount = attempt.fail_count + 1;
      let lockedUntil = null;
      
      // 达到3次失败，锁定30分钟
      if (newFailCount >= 3) {
        lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
      }
      
      await connection.query(
        `UPDATE user_login_attempts 
         SET fail_count = ?, locked_until = ?, last_failed_at = NOW() 
         WHERE identity = ?`,
        [newFailCount, lockedUntil, identity]
      );
    }
  }
}

module.exports = new AuthService();

