const db = require('../config/database');

class PlaybackService {
  /**
   * 批量上报播放事件
   */
  async reportEvents(userId, events) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const behaviorValues = events.map(event => [
        userId,
        event.songId,
        event.eventType,
        event.duration || 0,
        JSON.stringify(event.meta || {})
      ]);
      
      // 批量插入行为记录
      if (behaviorValues.length > 0) {
        const placeholders = behaviorValues.map(() => '(?, ?, ?, ?, ?)').join(', ');
        const flatValues = behaviorValues.flat();
        await connection.query(
          `INSERT INTO user_behaviors (user_id, song_id, behavior_type, duration, meta_json) 
           VALUES ${placeholders}`,
          flatValues
        );
      }
      
      // 如果是播放结束事件，更新播放历史
      const playEndEvents = events.filter(e => e.eventType === 'play_end');
      if (playEndEvents.length > 0) {
        const historyValues = playEndEvents.map(event => [
          userId,
          event.songId,
          event.duration || 0
        ]);
        const placeholders = historyValues.map(() => '(?, ?, ?)').join(', ');
        const flatValues = historyValues.flat();
        
        await connection.query(
          `INSERT INTO play_history (user_id, song_id, duration_sec) VALUES ${placeholders}`,
          flatValues
        );
      }
      
      await connection.commit();
      
      // TODO: 异步更新统计（由 worker 处理）
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new PlaybackService();

