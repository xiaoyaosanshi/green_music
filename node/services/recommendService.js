const db = require('../config/database');

class RecommendService {
  /**
   * 获取个性化推荐
   */
  async getPersonalRecommendations(userId, type = 'song', limit = 20) {
    const limitNum = parseInt(limit) || 20;
    // 1. 从数据库获取预计算的推荐
    const [recommendations] = await db.query(
      `SELECT ri.*, s.id, s.title, s.cover_url, s.duration, s.file_url,
              a.id as artist_id, a.name as artist_name
       FROM recommendation_items ri
       INNER JOIN songs s ON ri.item_id = s.id
       INNER JOIN artists a ON s.artist_id = a.id
       WHERE ri.user_id = ? AND ri.item_type = ? AND s.status = 1
       ORDER BY ri.score DESC
       LIMIT ?`,
      [parseInt(userId), type, limitNum]
    );
    
    // 2. 如果推荐不足，使用冷启动策略
    if (recommendations.length < limitNum) {
      const coldStart = await this.getColdStartRecommendations(
        type,
        limitNum - recommendations.length
      );
      recommendations.push(...coldStart);
    }
    
    // 3. 过滤已听/已收藏的歌曲
    const filtered = await this.filterListenedSongs(userId, recommendations);
    
    return {
      recommendations: filtered.map(r => ({
        songId: r.item_id || r.id,
        song: {
          id: r.id,
          title: r.title,
          coverUrl: r.cover_url,
          artist: { id: r.artist_id, name: r.artist_name }
        },
        score: r.score || 0.5,
        reason: r.reason || '热门推荐'
      }))
    };
  }

  /**
   * 冷启动推荐
   */
  async getColdStartRecommendations(type, limit) {
    const limitNum = parseInt(limit);
    const [hotSongs] = await db.query(
      `SELECT s.*, a.name as artist_name,
              COALESCE(SUM(ssd.play_count), 0) as total_plays
       FROM songs s
       INNER JOIN artists a ON s.artist_id = a.id
       LEFT JOIN song_stats_daily ssd ON s.id = ssd.song_id 
         AND ssd.stat_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       WHERE s.status = 1
       GROUP BY s.id
       ORDER BY total_plays DESC, s.created_at DESC
       LIMIT ?`,
      [limitNum]
    );
    
    return hotSongs.map(song => ({
      item_id: song.id,
      id: song.id,
      title: song.title,
      cover_url: song.cover_url,
      artist_id: song.artist_id,
      artist_name: song.artist_name,
      score: 0.5,
      reason: '热门推荐'
    }));
  }

  /**
   * 过滤已听/已收藏的歌曲
   */
  async filterListenedSongs(userId, recommendations) {
    const songIds = recommendations.map(r => r.item_id || r.id);
    
    if (songIds.length === 0) return recommendations;
    
    const [listened] = await db.query(
      `SELECT DISTINCT song_id FROM play_history WHERE user_id = ?
       UNION
       SELECT DISTINCT song_id FROM user_favorites WHERE user_id = ?`,
      [userId, userId]
    );
    
    const listenedSet = new Set(listened.map(r => r.song_id));
    
    return recommendations.filter(r => {
      const songId = r.item_id || r.id;
      return !listenedSet.has(songId);
    });
  }

  /**
   * 获取热门推荐
   */
  async getHotRecommend(type, limit) {
    const limitNum = parseInt(limit) || 20;
    const [hotSongs] = await db.query(
      `SELECT s.*, a.name as artist_name,
              COALESCE(SUM(ssd.play_count), 0) as total_plays
       FROM songs s
       INNER JOIN artists a ON s.artist_id = a.id
       LEFT JOIN song_stats_daily ssd ON s.id = ssd.song_id 
         AND ssd.stat_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       WHERE s.status = 1
       GROUP BY s.id
       ORDER BY total_plays DESC, s.created_at DESC
       LIMIT ?`,
      [limitNum]
    );
    
    return {
      list: hotSongs.map(song => ({
        id: song.id,
        title: song.title,
        coverUrl: song.cover_url,
        artist: { id: song.artist_id, name: song.artist_name }
      }))
    };
  }

  /**
   * 获取相似推荐
   */
  async getSimilarSongs(songId, limit = 10) {
    const limitNum = parseInt(limit);
    const [similar] = await db.query(
      `SELECT s2.*, a.name as artist_name
       FROM songs s1
       INNER JOIN song_genres sg1 ON s1.id = sg1.song_id
       INNER JOIN song_genres sg2 ON sg1.genre_id = sg2.genre_id
       INNER JOIN songs s2 ON sg2.song_id = s2.id
       INNER JOIN artists a ON s2.artist_id = a.id
       WHERE s1.id = ? AND s2.id != ? AND s2.status = 1
       GROUP BY s2.id
       ORDER BY COUNT(*) DESC
       LIMIT ?`,
      [parseInt(songId), parseInt(songId), limitNum]
    );
    
    return similar;
  }
}

module.exports = new RecommendService();

