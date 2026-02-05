const rateLimit = require('express-rate-limit');

/**
 * 登录限流（15分钟内最多10次）
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    code: 5001,
    message: '登录尝试次数过多，请稍后再试',
    data: null
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

/**
 * 通用 API 限流（1分钟内最多100次）
 */
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    code: 5001,
    message: '请求过于频繁，请稍后再试',
    data: null
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * 评论/点赞限流（1分钟内最多20次）
 */
const commentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: {
    code: 5001,
    message: '操作过于频繁，请稍后再试',
    data: null
  }
});

module.exports = {
  loginLimiter,
  apiLimiter,
  commentLimiter
};

