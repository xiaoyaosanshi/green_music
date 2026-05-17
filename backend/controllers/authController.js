const authService = require('../services/authService');
const ResponseHelper = require('../utils/response');

class AuthController {
  /**
   * 用户注册
   */
  async register(req, res, next) {
    try {
      const { username, password, email, nickname } = req.body;
      const result = await authService.register(username, password, email, nickname);
      
      if (result.code !== 0) {
        return ResponseHelper.error(res, result.code, result.message);
      }
      
      return ResponseHelper.success(res, result.data, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 用户登录
   */
  async login(req, res, next) {
    try {
      const { identity, password } = req.body;
      const ip = req.ip || req.connection.remoteAddress;
      const result = await authService.login(identity, password, ip);
      
      if (result.code !== 0) {
        return ResponseHelper.error(res, result.code, result.message);
      }
      
      return ResponseHelper.success(res, result.data, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

