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

      // 验证每个事件
      const validEventTypes = ['play_start', 'play_end', 'favorite', 'share', 'download'];
      for (const event of events) {
        if (!event.songId) {
          return ResponseHelper.error(res, 1001, '事件必须包含 songId');
        }
        if (!event.eventType || !validEventTypes.includes(event.eventType)) {
          return ResponseHelper.error(res, 1002, '无效的 eventType');
        }
      }

      await playbackService.reportEvents(req.user.userId, events);
      return ResponseHelper.success(res, null, '上报成功');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PlaybackController();

