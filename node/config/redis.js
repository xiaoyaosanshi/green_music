const redis = require('redis');
const logger = require('../utils/logger');

let client = null;

/**
 * 初始化 Redis 客户端
 */
async function initRedis() {
  if (client !== null) return client; // 如果已经尝试过连接，直接返回（避免重复尝试）
  if (client === undefined) {
    client = null; // 标记为已尝试
  }

  try {
    const redisClient = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379
      },
      password: process.env.REDIS_PASSWORD || undefined
    });

    redisClient.on('error', (err) => {
      logger.error('Redis 客户端错误:', err);
      client = null; // 连接失败，设置为 null
    });

    redisClient.on('connect', () => {
      logger.info('Redis 连接成功');
    });

    await redisClient.connect();
    client = redisClient;
    return client;
  } catch (error) {
    logger.warn('Redis 连接失败，服务将继续运行（不使用缓存）:', error.message);
    client = null;
    return null;
  }
}

/**
 * 获取 Redis 客户端
 */
async function getRedis() {
  if (!client) {
    await initRedis();
  }
  return client;
}

/**
 * Redis 操作封装
 */
const redisClient = {
  async get(key) {
    const client = await getRedis();
    if (!client) return null;
    try {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis GET 错误:', error);
      return null;
    }
  },

  async set(key, value, expireSeconds) {
    const client = await getRedis();
    if (!client) return false;
    try {
      const strValue = JSON.stringify(value);
      if (expireSeconds) {
        await client.setEx(key, expireSeconds, strValue);
      } else {
        await client.set(key, strValue);
      }
      return true;
    } catch (error) {
      logger.error('Redis SET 错误:', error);
      return false;
    }
  },

  async del(key) {
    const client = await getRedis();
    if (!client) return false;
    try {
      await client.del(key);
      return true;
    } catch (error) {
      logger.error('Redis DEL 错误:', error);
      return false;
    }
  },

  async exists(key) {
    const client = await getRedis();
    if (!client) return false;
    try {
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXISTS 错误:', error);
      return false;
    }
  }
};

module.exports = {
  ...redisClient,
  getRedis  // 导出 getRedis 用于关闭连接
};

