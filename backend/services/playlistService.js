const db = require('../config/database');
const { ERROR_CODES } = require('../utils/constants');

class PlaylistService {
  /**
   * 获取歌单列表
   */
  async getPlaylistList({ page = 1, pageSize = 20, userId, keyword }) {
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);
    const conditions = [];
    const params = [];
    
    if (userId) {
      conditions.push('p.user_id = ?');
      params.push(parseInt(userId));
    } else {
      conditions.push('p.is_public = 1');
    }
    
    if (keyword) {
      conditions.push('p.name LIKE ?');
      params.push(`%${keyword}%`);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    // 确保 limit 和 offset 是有效的整数
    const limitNum = parseInt(limit) || 20;
    const offsetNum = parseInt(offset) || 0;
    params.push(limitNum, offsetNum);
    
    const [rows] = await db.query(
      `SELECT p.*, u.id as user_id, u.username, u.nickname, u.avatar,
              COUNT(ps.song_id) as song_count
       FROM playlists p
       INNER JOIN users u ON p.user_id = u.id
       LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
       ${whereClause}
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );
    
    // 获取总数时，需要排除 LIMIT 和 OFFSET 参数
    const countParams = params.length > 2 ? params.slice(0, -2) : [];
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM playlists p ${whereClause}`,
      countParams
    );
    
    return {
      list: rows,
      total: countRows[0].total
    };
  }

  /**
   * 获取歌单详情
   */
  async getPlaylistDetail(playlistId, userId = null) {
    const [playlists] = await db.query(
      `SELECT p.*, u.id as user_id, u.username, u.nickname, u.avatar
       FROM playlists p
       INNER JOIN users u ON p.user_id = u.id
       WHERE p.id = ? AND (p.is_public = 1 OR p.user_id = ?)`,
      [playlistId, userId]
    );
    
    if (playlists.length === 0) {
      throw new Error('歌单不存在');
    }
    
    const playlist = playlists[0];
    
    // 获取歌曲列表
    const [songs] = await db.query(
      `SELECT s.*, a.name as artist_name, ps.sort_order
       FROM playlist_songs ps
       INNER JOIN songs s ON ps.song_id = s.id
       INNER JOIN artists a ON s.artist_id = a.id
       WHERE ps.playlist_id = ?
       ORDER BY ps.sort_order ASC, ps.added_at ASC`,
      [playlistId]
    );
    
    return {
      ...playlist,
      songs
    };
  }

  /**
   * 创建歌单
   */
  async createPlaylist(userId, name, description, isPublic) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 1. 检查歌单数量限制（最多50个）
      const [countRows] = await connection.query(
        `SELECT COUNT(*) as count FROM playlists WHERE user_id = ?`,
        [userId]
      );
      
      if (countRows[0].count >= 50) {
        await connection.rollback();
        throw new Error('歌单数量已达上限（50个）');
      }
      
      // 2. 检查同名歌单
      const [existing] = await connection.query(
        `SELECT id FROM playlists WHERE user_id = ? AND name = ?`,
        [userId, name]
      );
      
      if (existing.length > 0) {
        await connection.rollback();
        throw new Error('歌单名称已存在');
      }
      
      // 3. 创建歌单
      const [result] = await connection.query(
        `INSERT INTO playlists (user_id, name, description, is_public) 
         VALUES (?, ?, ?, ?)`,
        [userId, name, description, isPublic ? 1 : 0]
      );
      
      await connection.commit();
      
      return { playlistId: result.insertId };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 更新歌单
   */
  async updatePlaylist(userId, playlistId, data) {
    // 检查权限
    const [playlists] = await db.query(
      `SELECT user_id FROM playlists WHERE id = ?`,
      [playlistId]
    );
    
    if (playlists.length === 0) {
      throw new Error('歌单不存在');
    }
    
    if (playlists[0].user_id !== userId) {
      throw new Error('无权限修改');
    }
    
    const allowedFields = ['name', 'description', 'is_public', 'cover_url'];
    const updateFields = [];
    const values = [];
    
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        values.push(data[field]);
      }
    });
    
    if (updateFields.length === 0) {
      throw new Error('没有可更新的字段');
    }
    
    values.push(playlistId);
    
    await db.query(
      `UPDATE playlists SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );
    
    return await this.getPlaylistDetail(playlistId, userId);
  }

  /**
   * 删除歌单
   */
  async deletePlaylist(userId, playlistId) {
    const [playlists] = await db.query(
      `SELECT user_id FROM playlists WHERE id = ?`,
      [playlistId]
    );
    
    if (playlists.length === 0) {
      throw new Error('歌单不存在');
    }
    
    if (playlists[0].user_id !== userId) {
      throw new Error('无权限删除');
    }
    
    await db.query(`DELETE FROM playlists WHERE id = ?`, [playlistId]);
  }

  /**
   * 添加歌曲到歌单
   */
  async addSongToPlaylist(userId, playlistId, songId) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 检查权限
      const [playlists] = await connection.query(
        `SELECT user_id FROM playlists WHERE id = ?`,
        [playlistId]
      );
      
      if (playlists.length === 0) {
        throw new Error('歌单不存在');
      }
      
      if (playlists[0].user_id !== userId) {
        throw new Error('无权限操作');
      }
      
      // 检查是否已存在
      const [existing] = await connection.query(
        `SELECT id FROM playlist_songs WHERE playlist_id = ? AND song_id = ?`,
        [playlistId, songId]
      );
      
      if (existing.length > 0) {
        await connection.rollback();
        throw new Error('歌曲已在歌单中');
      }
      
      // 获取当前最大排序索引
      const [maxOrder] = await connection.query(
        `SELECT MAX(sort_order) as max_order FROM playlist_songs WHERE playlist_id = ?`,
        [playlistId]
      );

      const nextOrder = (maxOrder[0].max_order || 0) + 1;

      // 添加歌曲
      await connection.query(
        `INSERT INTO playlist_songs (playlist_id, song_id, sort_order)
         VALUES (?, ?, ?)`,
        [playlistId, songId, nextOrder]
      );
      
      await connection.commit();
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 从歌单移除歌曲
   */
  async removeSongFromPlaylist(userId, playlistId, songId) {
    // 检查权限
    const [playlists] = await db.query(
      `SELECT user_id FROM playlists WHERE id = ?`,
      [playlistId]
    );
    
    if (playlists.length === 0) {
      throw new Error('歌单不存在');
    }
    
    if (playlists[0].user_id !== userId) {
      throw new Error('无权限操作');
    }
    
    await db.query(
      `DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?`,
      [playlistId, songId]
    );
  }
}

module.exports = new PlaylistService();

