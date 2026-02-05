const playlistService = require('../services/playlistService');
const ResponseHelper = require('../utils/response');

class PlaylistController {
  /**
   * 获取歌单列表
   */
  async getPlaylistList(req, res, next) {
    try {
      const { page = 1, pageSize = 20, userId, keyword } = req.query;
      const result = await playlistService.getPlaylistList({ page, pageSize, userId, keyword });
      return ResponseHelper.pagination(res, result.list, result.total, page, pageSize);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取歌单详情
   */
  async getPlaylistDetail(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const result = await playlistService.getPlaylistDetail(id, userId);
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 创建歌单
   */
  async createPlaylist(req, res, next) {
    try {
      const { name, description, isPublic = true } = req.body;
      const result = await playlistService.createPlaylist(req.user.userId, name, description, isPublic);
      return ResponseHelper.success(res, result, '创建成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新歌单
   */
  async updatePlaylist(req, res, next) {
    try {
      const { id } = req.params;
      const result = await playlistService.updatePlaylist(req.user.userId, id, req.body);
      return ResponseHelper.success(res, result, '更新成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除歌单
   */
  async deletePlaylist(req, res, next) {
    try {
      const { id } = req.params;
      await playlistService.deletePlaylist(req.user.userId, id);
      return ResponseHelper.success(res, null, '删除成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 添加歌曲到歌单
   */
  async addSongToPlaylist(req, res, next) {
    try {
      const { id } = req.params;
      const { songId } = req.body;
      await playlistService.addSongToPlaylist(req.user.userId, id, songId);
      return ResponseHelper.success(res, null, '添加成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 从歌单移除歌曲
   */
  async removeSongFromPlaylist(req, res, next) {
    try {
      const { id, songId } = req.params;
      await playlistService.removeSongFromPlaylist(req.user.userId, id, songId);
      return ResponseHelper.success(res, null, '移除成功');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PlaylistController();

