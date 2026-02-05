const logger = require('../utils/logger');
const ResponseHelper = require('../utils/response');
const { ERROR_CODES } = require('../utils/constants');

/**
 * 错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  logger.error('请求错误:', {
    method: req.method,
    url: req.url,
    error: err.message,
    stack: err.stack
  });

  // 已知错误
  if (err.code && err.message) {
    return ResponseHelper.error(res, err.code, err.message);
  }

  // 数据库错误
  if (err.code === 'ER_DUP_ENTRY') {
    return ResponseHelper.error(
      res,
      ERROR_CODES.CONFLICT,
      '数据已存在'
    );
  }

  // 默认错误
  return ResponseHelper.error(
    res,
    ERROR_CODES.VALIDATION_ERROR,
    process.env.NODE_ENV === 'production' 
      ? '服务器内部错误' 
      : err.message,
    500
  );
};

module.exports = { errorHandler };

