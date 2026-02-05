const playbackService = require('../services/playbackService');
const ResponseHelper = require('../utils/response');

class PlaybackController {
  /**
   * 上报播放事件（批量）
   */
  async reportEvents(req, res, next) {
    try {
      const { events } = req.body;
      if (!Array.isArray(events) || events.length === 0) {
        return ResponseHelper.error(res, 1000, '事件列表不能为空');
      }
      
      await playbackService.reportEvents(req.user.userId, events);
      return ResponseHelper.success(res, null, '上报成功');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PlaybackController();

