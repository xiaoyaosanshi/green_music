const adminService = require('../services/adminService');
const ResponseHelper = require('../utils/response');

class AdminController {
  /**
   * 管理员登录
   */
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await adminService.login(username, password);
      return ResponseHelper.success(res, result.data, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取歌曲列表（管理）
   */
  async getSongList(req, res, next) {
    try {
      const { page = 1, pageSize = 20, keyword, status, genreId } = req.query;
      const result = await adminService.getSongList({ page, pageSize, keyword, status, genreId });
      return ResponseHelper.pagination(res, result.list, result.total, page, pageSize);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 创建歌曲
   */
  async createSong(req, res, next) {
    try {
      // 处理文件上传
      const data = { ...req.body };
      if (req.files) {
        if (req.files.cover && req.files.cover[0]) {
          let coverUrl = req.files.cover[0].path.replace(/\\/g, '/');
          if (!coverUrl.startsWith('/')) {
            coverUrl = '/' + coverUrl;
          }
          data.coverUrl = coverUrl;
        }
        if (req.files.file && req.files.file[0]) {
          let fileUrl = req.files.file[0].path.replace(/\\/g, '/');
          if (!fileUrl.startsWith('/')) {
            fileUrl = '/' + fileUrl;
          }
          data.fileUrl = fileUrl;
        }
      }
      const result = await adminService.createSong(data);
      return ResponseHelper.success(res, result, '创建成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新歌曲
   */
  async updateSong(req, res, next) {
    try {
      const { id } = req.params;
      // 处理文件上传
      const data = { ...req.body };
      if (req.files) {
        if (req.files.cover && req.files.cover[0]) {
          let coverUrl = req.files.cover[0].path.replace(/\\/g, '/');
          if (!coverUrl.startsWith('/')) {
            coverUrl = '/' + coverUrl;
          }
          data.coverUrl = coverUrl;
        }
        if (req.files.file && req.files.file[0]) {
          let fileUrl = req.files.file[0].path.replace(/\\/g, '/');
          if (!fileUrl.startsWith('/')) {
            fileUrl = '/' + fileUrl;
          }
          data.fileUrl = fileUrl;
        }
      }
      const result = await adminService.updateSong(id, data);
      return ResponseHelper.success(res, result, '更新成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除歌曲
   */
  async deleteSong(req, res, next) {
    try {
      const { id } = req.params;
      await adminService.deleteSong(id);
      return ResponseHelper.success(res, null, '删除成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取歌词列表（审核）
   */
  async getLyricList(req, res, next) {
    try {
      const { page = 1, pageSize = 20, songId, status } = req.query;
      const result = await adminService.getLyricList({ page, pageSize, songId, status });
      return ResponseHelper.pagination(res, result.list, result.total, page, pageSize);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 审核歌词
   */
  async reviewLyric(req, res, next) {
    try {
      const { id } = req.params;
      const { status, remark } = req.body;
      await adminService.reviewLyric(id, status, remark);
      return ResponseHelper.success(res, null, '审核成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取数据统计
   */
  async getStatistics(req, res, next) {
    try {
      const result = await adminService.getStatistics();
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取音乐详情
   */
  async getSongDetail(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.getSongDetail(id);
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 上架/下架音乐
   */
  async updateSongStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await adminService.updateSongStatus(id, status);
      return ResponseHelper.success(res, result, '操作成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 批量操作音乐
   */
  async batchOperateSongs(req, res, next) {
    try {
      const { ids, action, data } = req.body;
      const result = await adminService.batchOperateSongs(ids, action, data);
      return ResponseHelper.success(res, result, '批量操作成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取管理员信息
   */
  async getAdminInfo(req, res, next) {
    try {
      const adminId = req.user.userId;
      const result = await adminService.getAdminInfo(adminId);
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  // ==================== 专辑管理 ====================

  /**
   * 获取专辑列表
   */
  async getAlbumList(req, res, next) {
    try {
      const { page = 1, pageSize = 20, keyword, artist_id } = req.query;
      const result = await adminService.getAlbumList({ page, pageSize, keyword, artist_id });
      return ResponseHelper.pagination(res, result.list, result.total, page, pageSize);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取专辑详情
   */
  async getAlbumDetail(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.getAlbumDetail(id);
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 创建专辑
   */
  async createAlbum(req, res, next) {
    try {
      const result = await adminService.createAlbum(req.body);
      return ResponseHelper.success(res, result, '创建成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新专辑
   */
  async updateAlbum(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.updateAlbum(id, req.body);
      return ResponseHelper.success(res, result, '更新成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除专辑
   */
  async deleteAlbum(req, res, next) {
    try {
      const { id } = req.params;
      await adminService.deleteAlbum(id);
      return ResponseHelper.success(res, null, '删除成功');
    } catch (error) {
      next(error);
    }
  }

  // ==================== 歌词管理 ====================

  /**
   * 上传官方歌词
   */
  async createLyric(req, res, next) {
    try {
      const result = await adminService.createLyric(req.body);
      return ResponseHelper.success(res, result, '上传成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除歌词
   */
  async deleteLyric(req, res, next) {
    try {
      const { id } = req.params;
      await adminService.deleteLyric(id);
      return ResponseHelper.success(res, null, '删除成功');
    } catch (error) {
      next(error);
    }
  }

  // ==================== 用户管理 ====================

  /**
   * 获取用户列表
   */
  async getUserList(req, res, next) {
    try {
      const { page = 1, pageSize = 20, keyword, status } = req.query;
      const result = await adminService.getUserList({ page, pageSize, keyword, status });
      return ResponseHelper.pagination(res, result.list, result.total, page, pageSize);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取用户详情
   */
  async getUserDetail(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.getUserDetail(id);
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 禁用/启用用户
   */
  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await adminService.updateUserStatus(id, status);
      return ResponseHelper.success(res, result, '操作成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 重置用户密码
   */
  async resetUserPassword(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.resetUserPassword(id);
      return ResponseHelper.success(res, result, '密码重置成功，已发送重置链接到用户邮箱');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除用户
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await adminService.deleteUser(id);
      return ResponseHelper.success(res, null, '删除成功');
    } catch (error) {
      next(error);
    }
  }

  // ==================== 评论管理 ====================

  /**
   * 获取评论列表
   */
  async getCommentList(req, res, next) {
    try {
      const { page = 1, pageSize = 20, keyword, review_status, song_id } = req.query;
      const result = await adminService.getCommentList({ page, pageSize, keyword, review_status, song_id });
      return ResponseHelper.pagination(res, result.list, result.total, page, pageSize);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取评论详情
   */
  async getCommentDetail(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.getCommentDetail(id);
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 审核评论
   */
  async reviewComment(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await adminService.reviewComment(id, status);
      return ResponseHelper.success(res, null, '审核成功');
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
      await adminService.deleteComment(id);
      return ResponseHelper.success(res, null, '删除成功');
    } catch (error) {
      next(error);
    }
  }

  // ==================== 歌单管理 ====================

  /**
   * 获取歌单列表
   */
  async getPlaylistList(req, res, next) {
    try {
      const { page = 1, pageSize = 20, keyword, is_public, user_id } = req.query;
      const result = await adminService.getPlaylistList({ page, pageSize, keyword, is_public, user_id });
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
      const result = await adminService.getPlaylistDetail(id);
      return ResponseHelper.success(res, result);
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
      const result = await adminService.updatePlaylist(id, req.body);
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
      await adminService.deletePlaylist(id);
      return ResponseHelper.success(res, null, '删除成功');
    } catch (error) {
      next(error);
    }
  }

  // ==================== 数据统计 ====================

  /**
   * 获取用户统计
   */
  async getUserStatistics(req, res, next) {
    try {
      const { start_date, end_date, period } = req.query;
      const result = await adminService.getUserStatistics({ start_date, end_date, period });
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取音乐统计
   */
  async getSongStatistics(req, res, next) {
    try {
      const { start_date, end_date } = req.query;
      const result = await adminService.getSongStatistics({ start_date, end_date });
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取播放统计
   */
  async getPlaybackStatistics(req, res, next) {
    try {
      const { start_date, end_date } = req.query;
      const result = await adminService.getPlaybackStatistics({ start_date, end_date });
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取推荐统计
   */
  async getRecommendStatistics(req, res, next) {
    try {
      const { start_date, end_date } = req.query;
      const result = await adminService.getRecommendStatistics({ start_date, end_date });
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  // ==================== 操作日志 ====================

  /**
   * 获取操作日志列表
   */
  async getLogList(req, res, next) {
    try {
      const { page = 1, pageSize = 20, keyword, admin_id, action_type, target_type, start_date, end_date } = req.query;
      const result = await adminService.getLogList({ page, pageSize, keyword, admin_id, action_type, target_type, start_date, end_date });
      return ResponseHelper.pagination(res, result.list, result.total, page, pageSize);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取日志详情
   */
  async getLogDetail(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.getLogDetail(id);
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();

