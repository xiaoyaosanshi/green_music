const jwt = require('jsonwebtoken');
const { ERROR_CODES } = require('../utils/constants');
const ResponseHelper = require('../utils/response');

/**
 * JWT 认证中间件
 */
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return ResponseHelper.error(
      res,
      ERROR_CODES.AUTH_TOKEN_INVALID,
      '未提供认证令牌',
      401
    );
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { 
      userId: decoded.userId, 
      username: decoded.username 
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ResponseHelper.error(
        res,
        ERROR_CODES.AUTH_TOKEN_EXPIRED,
        '令牌已过期',
        401
      );
    }
    return ResponseHelper.error(
      res,
      ERROR_CODES.AUTH_TOKEN_INVALID,
      '令牌无效',
      401
    );
  }
};

module.exports = { authenticate };

