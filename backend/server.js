require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');
const db = require('./config/database');

const PORT = process.env.PORT || 3001;

// 数据库连接测试
async function startServer() {
  try {
    // 测试数据库连接
    await db.query('SELECT 1');
    logger.info('数据库连接成功');

    // 启动服务器
    app.listen(PORT, () => {
      logger.info(`服务器运行在 http://localhost:${PORT}`);
      logger.info(`环境: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('服务器启动失败:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGTERM', async () => {
  logger.info('收到 SIGTERM 信号，正在关闭服务器...');
  await db.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('收到 SIGINT 信号，正在关闭服务器...');
  await db.end();
  process.exit(0);
});

startServer();
