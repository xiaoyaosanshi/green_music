const userService = require('../services/userService');
const ResponseHelper = require('../utils/response');

class UserController {
  /**
   * 获取当前用户信息
   */
  async getCurrentUser(req, res, next) {
    try {
      const result = await userService.getUserInfo(req.user.userId);
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新用户信息
   */
  async updateUser(req, res, next) {
    try {
      const { nickname, avatar, gender, birthday } = req.body;

      // 检查是否有可更新字段
      const hasValidField = [nickname, avatar, gender, birthday].some(
        v => v !== undefined && v !== null && v !== ''
      );

      if (!hasValidField) {
        return ResponseHelper.error(res, 1000, '请提供至少一个要更新的字段 (nickname, avatar, gender, birthday)');
      }

      const result = await userService.updateUser(req.user.userId, req.body);
      return ResponseHelper.success(res, result, '更新成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 修改密码
   */
  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      await userService.changePassword(req.user.userId, oldPassword, newPassword);
      return ResponseHelper.success(res, null, '密码修改成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取播放历史
   */
  async getPlayHistory(req, res, next) {
    try {
      const { page = 1, pageSize = 20 } = req.query;
      const result = await userService.getPlayHistory(req.user.userId, page, pageSize);
      return ResponseHelper.pagination(res, result.list, result.total, page, pageSize);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 清空播放历史
   */
  async clearPlayHistory(req, res, next) {
    try {
      await userService.clearPlayHistory(req.user.userId);
      return ResponseHelper.success(res, null, '清空成功');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();

