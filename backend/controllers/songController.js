const songService = require('../services/songService');
const ResponseHelper = require('../utils/response');

class SongController {
  /**
   * 获取歌曲列表
   */
  async getSongList(req, res, next) {
    try {
      const { page = 1, pageSize = 20, keyword, genreId, artistId } = req.query;
      const result = await songService.getSongList({ page, pageSize, keyword, genreId, artistId });
      return ResponseHelper.pagination(res, result.list, result.total, page, pageSize);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取歌曲详情
   */
  async getSongDetail(req, res, next) {
    try {
      const { id } = req.params;
      const result = await songService.getSongDetail(id);
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取歌词
   */
  async getLyrics(req, res, next) {
    try {
      const { id } = req.params;
      const { language = 'zh', lyricType = 1 } = req.query;
      const result = await songService.getLyrics(id, language, lyricType);
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SongController();

