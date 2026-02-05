const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'green_music',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// 封装查询方法
const db = {
  /**
   * 执行查询
   */
  async query(sql, params) {
    try {
      // 确保 params 是数组，如果未提供则使用空数组
      let queryParams = Array.isArray(params) ? params : (params ? [params] : []);
      // 确保所有参数都是有效值，并转换数字类型
      queryParams = queryParams.map(p => {
        if (p === undefined) return null;
        // 如果是数字字符串，转换为数字
        if (typeof p === 'string' && /^\d+$/.test(p)) {
          return parseInt(p, 10);
        }
        // 确保数字是整数
        if (typeof p === 'number' && !isNaN(p)) {
          return Math.floor(p);
        }
        return p;
      });
      // 使用 query 方法而不是 execute，避免参数类型问题
      const [rows] = await pool.query(sql, queryParams);
      return [rows];
    } catch (error) {
      logger.error('数据库查询错误:', { sql, params, error: error.message });
      throw error;
    }
  },

  /**
   * 获取连接（用于事务）
   */
  async getConnection() {
    return await pool.getConnection();
  },

  /**
   * 关闭连接池
   */
  async end() {
    await pool.end();
    logger.info('数据库连接池已关闭');
  }
};

module.exports = db;

