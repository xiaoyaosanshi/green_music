const { ERROR_CODES } = require('../utils/constants');
const ResponseHelper = require('../utils/response');
const db = require('../config/database');

/**
 * 管理员认证中间件
 */
const adminAuth = async (req, res, next) => {
  try {
    const [admins] = await db.query(
      'SELECT * FROM admins WHERE id = ? AND status = 1',
      [req.user.userId]
    );

    if (admins.length === 0) {
      return ResponseHelper.error(
        res,
        ERROR_CODES.FORBIDDEN,
        '无权限访问',
        403
      );
    }

    req.admin = admins[0];
    next();
  } catch (error) {
    return ResponseHelper.error(
      res,
      ERROR_CODES.FORBIDDEN,
      '权限验证失败',
      403
    );
  }
};

module.exports = { adminAuth };

