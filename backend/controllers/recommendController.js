const recommendService = require('../services/recommendService');
const ResponseHelper = require('../utils/response');

class RecommendController {
  /**
   * 获取个性化推荐
   */
  async getPersonalRecommend(req, res, next) {
    try {
      const { type = 'song', limit = 20 } = req.query;
      const result = await recommendService.getPersonalRecommendations(
        req.user.userId,
        type,
        parseInt(limit)
      );
      return ResponseHelper.success(res, result.data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取热门推荐
   */
  async getHotRecommend(req, res, next) {
    try {
      const { type = 'song', limit = 20 } = req.query;
      const result = await recommendService.getHotRecommend(type, parseInt(limit));
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取相似推荐
   */
  async getSimilarRecommend(req, res, next) {
    try {
      const { songId } = req.params;
      const { limit = 10 } = req.query;
      const result = await recommendService.getSimilarSongs(songId, parseInt(limit));
      return ResponseHelper.success(res, { list: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecommendController();

