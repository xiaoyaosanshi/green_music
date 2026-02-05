require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');
const db = require('./config/database');
const redisClient = require('./config/redis');

const PORT = process.env.PORT || 3001;

// 数据库连接测试
async function startServer() {
  try {
    // 测试数据库连接
    await db.query('SELECT 1');
    logger.info('数据库连接成功');

    // 初始化 Redis 连接（可选，失败不影响服务启动）
    try {
      // 触发 Redis 连接初始化
      const testValue = await redisClient.get('__init_test__');
      logger.info('Redis 连接成功');
    } catch (error) {
      logger.warn('Redis 连接失败，服务将继续运行（不使用缓存）:', error.message);
    }

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
  // 关闭 Redis 连接
  try {
    const redis = require('./config/redis');
    const client = await redis.getRedis();
    if (client) {
      await client.quit();
      logger.info('Redis 连接已关闭');
    }
  } catch (error) {
    // 忽略 Redis 关闭错误
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('收到 SIGINT 信号，正在关闭服务器...');
  await db.end();
  // 关闭 Redis 连接
  try {
    const redis = require('./config/redis');
    const client = await redis.getRedis();
    if (client) {
      await client.quit();
      logger.info('Redis 连接已关闭');
    }
  } catch (error) {
    // 忽略 Redis 关闭错误
  }
  process.exit(0);
});

startServer();

