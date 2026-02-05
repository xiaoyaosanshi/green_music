const db = require('../config/database');
const { ERROR_CODES } = require('../utils/constants');

class SongService {
  /**
   * 获取歌曲列表
   */
  async getSongList({ page = 1, pageSize = 20, keyword, genreId, artistId }) {
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 20;
    const offsetNum = (pageNum - 1) * pageSizeNum;
    const limitNum = pageSizeNum;
    const conditions = ['s.status = 1'];
    const params = [];
    
    if (keyword) {
      conditions.push('(s.title LIKE ? OR a.name LIKE ?)');
      const keywordPattern = `%${keyword}%`;
      params.push(keywordPattern, keywordPattern);
    }
    
    if (genreId) {
      const genreIdNum = parseInt(genreId);
      if (!isNaN(genreIdNum)) {
        conditions.push('EXISTS (SELECT 1 FROM song_genres sg WHERE sg.song_id = s.id AND sg.genre_id = ?)');
        params.push(genreIdNum);
      }
    }
    
    if (artistId) {
      const artistIdNum = parseInt(artistId);
      if (!isNaN(artistIdNum)) {
        conditions.push('s.artist_id = ?');
        params.push(artistIdNum);
      }
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // 确保 limit 和 offset 是有效的整数
    params.push(limitNum, offsetNum);
    
    const [rows] = await db.query(
      `SELECT s.*, a.id as artist_id, a.name as artist_name,
              al.id as album_id, al.title as album_name
       FROM songs s
       INNER JOIN artists a ON s.artist_id = a.id
       LEFT JOIN albums al ON s.album_id = al.id
       ${whereClause}
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );
    
    // 获取总数
    const countParams = params.length > 2 ? params.slice(0, -2) : [];
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total 
       FROM songs s
       INNER JOIN artists a ON s.artist_id = a.id
       ${whereClause}`,
      countParams
    );
    
    return {
      list: rows,
      total: countRows[0].total
    };
  }

  /**
   * 获取歌曲详情
   */
  async getSongDetail(songId) {
    const [songs] = await db.query(
      `SELECT s.*, a.id as artist_id, a.name as artist_name, a.avatar as artist_avatar,
              al.id as album_id, al.title as album_name, al.cover_url as album_cover
       FROM songs s
       INNER JOIN artists a ON s.artist_id = a.id
       LEFT JOIN albums al ON s.album_id = al.id
       WHERE s.id = ? AND s.status = 1`,
      [songId]
    );
    
    if (songs.length === 0) {
      throw new Error('歌曲不存在');
    }
    
    // 获取歌曲类型
    const [genres] = await db.query(
      `SELECT g.id, g.name 
       FROM genres g
       INNER JOIN song_genres sg ON g.id = sg.genre_id
       WHERE sg.song_id = ?`,
      [songId]
    );
    
    return {
      ...songs[0],
      genres
    };
  }

  /**
   * 获取歌词
   */
  async getLyrics(songId, language = 'zh') {
    const [lyrics] = await db.query(
      `SELECT * FROM lyrics 
       WHERE song_id = ? AND language = ?`,
      [songId, language]
    );
    
    if (lyrics.length === 0) {
      return {
        songId,
        lyrics: []
      };
    }
    
    return {
      songId,
      lyrics: lyrics.map(l => ({
        id: l.id,
        language: l.language,
        content: l.lrc_content
      }))
    };
  }
}

module.exports = new SongService();

