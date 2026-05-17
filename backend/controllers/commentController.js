const commentService = require('../services/commentService');
const ResponseHelper = require('../utils/response');

class CommentController {
  /**
   * 获取评论列表
   */
  async getCommentList(req, res, next) {
    try {
      const { songId, page = 1, pageSize = 20, sort = 'time' } = req.query;

      // 验证 songId 参数
      if (!songId || isNaN(parseInt(songId))) {
        return ResponseHelper.error(res, 1000, 'songId 参数无效');
      }

      const result = await commentService.getCommentList(songId, page, pageSize, sort);
      return ResponseHelper.pagination(res, result.list, result.total, page, pageSize);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 发表评论
   */
  async createComment(req, res, next) {
    try {
      const { songId, content, parentId = 0 } = req.body;
      const result = await commentService.createComment(req.user.userId, songId, content, parentId);
      return ResponseHelper.success(res, result.data, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 点赞评论
   */
  async likeComment(req, res, next) {
    try {
      const { id } = req.params;
      await commentService.likeComment(req.user.userId, id);
      return ResponseHelper.success(res, null, '点赞成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 取消点赞
   */
  async unlikeComment(req, res, next) {
    try {
      const { id } = req.params;
      await commentService.unlikeComment(req.user.userId, id);
      return ResponseHelper.success(res, null, '取消点赞成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除评论
   */
  async deleteComment(req, res, next) {
    try {
      const { id } = req.params;
      await commentService.deleteComment(req.user.userId, id);
      return ResponseHelper.success(res, null, '删除成功');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController();

