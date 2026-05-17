const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { ERROR_CODES } = require('../utils/constants');

class AdminService {
  /**
   * 管理员登录
   */
  async login(username, password) {
    const [admins] = await db.query(
      `SELECT * FROM admins WHERE username = ? AND status = 1`,
      [username]
    );
    
    if (admins.length === 0) {
      return {
        code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
        message: '账号或密码错误'
      };
    }
    
    const admin = admins[0];
    const isValid = await bcrypt.compare(password, admin.password_hash);
    
    if (!isValid) {
      return {
        code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
        message: '账号或密码错误'
      };
    }
    
    // 更新最后登录时间
    await db.query(
      `UPDATE admins SET last_login_at = NOW() WHERE id = ?`,
      [admin.id]
    );
    
    // 生成 Token
    const token = jwt.sign(
      { userId: admin.id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      code: ERROR_CODES.SUCCESS,
      message: '登录成功',
      data: {
        token,
        adminInfo: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      }
    };
  }

  /**
   * 获取歌曲列表（管理）
   */
  async getSongList({ page = 1, pageSize = 20, keyword, status, genreId }) {
    const offset = (page - 1) * pageSize;
    const conditions = [];
    const params = [];
    
    if (keyword) {
      conditions.push('(s.title LIKE ? OR a.name LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    
    if (status !== undefined) {
      conditions.push('s.status = ?');
      params.push(status);
    }
    
    if (genreId) {
      conditions.push('EXISTS (SELECT 1 FROM song_genres sg WHERE sg.song_id = s.id AND sg.genre_id = ?)');
      params.push(genreId);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(pageSize, offset);
    
    const [rows] = await db.query(
      `SELECT s.*, a.name as artist_name
       FROM songs s
       INNER JOIN artists a ON s.artist_id = a.id
       ${whereClause}
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );
    
    const countParams = params.slice(0, -2);
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM songs s ${whereClause}`,
      countParams
    );
    
    return {
      list: rows,
      total: countRows[0].total
    };
  }

  /**
   * 创建歌曲
   */
  async createSong(data) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const [result] = await connection.query(
        `INSERT INTO songs (title, artist_id, album_id, duration, file_url, cover_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.title, data.artistId, data.albumId, data.duration, data.fileUrl, data.coverUrl, data.status || 1]
      );
      
      const songId = result.insertId;
      
      // 添加类型关联
      if (data.genreIds && data.genreIds.length > 0) {
        const genreValues = data.genreIds.map(genreId => [songId, genreId]);
        await connection.query(
          `INSERT INTO song_genres (song_id, genre_id) VALUES ?`,
          [genreValues]
        );
      }
      
      await connection.commit();
      return { songId };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 更新歌曲
   */
  async updateSong(songId, data) {
    const allowedFields = ['title', 'artist_id', 'album_id', 'cover_url', 'status'];
    const updateFields = [];
    const values = [];
    
    allowedFields.forEach(field => {
      const key = field === 'artist_id' ? 'artistId' : 
                  field === 'album_id' ? 'albumId' : 
                  field.toLowerCase();
      if (data[key] !== undefined) {
        updateFields.push(`${field} = ?`);
        values.push(data[key]);
      }
    });
    
    if (updateFields.length === 0) {
      throw new Error('没有可更新的字段');
    }
    
    values.push(songId);
    
    await db.query(
      `UPDATE songs SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );
    
    return await db.query(`SELECT * FROM songs WHERE id = ?`, [songId]);
  }

  /**
   * 删除歌曲
   */
  async deleteSong(songId) {
    await db.query(`UPDATE songs SET status = 0 WHERE id = ?`, [songId]);
  }

  /**
   * 获取歌词列表（审核）
   */
  async getLyricList({ page = 1, pageSize = 20, songId, status }) {
    const offset = (page - 1) * pageSize;
    const conditions = [];
    const params = [];
    
    if (songId) {
      conditions.push('l.song_id = ?');
      params.push(songId);
    }
    
    if (status !== undefined) {
      conditions.push('l.status = ?');
      params.push(status);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(pageSize, offset);
    
    const [rows] = await db.query(
      `SELECT l.*, s.title as song_title, u.username as uploader_name
       FROM lyrics l
       INNER JOIN songs s ON l.song_id = s.id
       LEFT JOIN users u ON l.uploader_id = u.id
       ${whereClause}
       ORDER BY l.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );
    
    const countParams = params.slice(0, -2);
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM lyrics l ${whereClause}`,
      countParams
    );
    
    return {
      list: rows,
      total: countRows[0].total
    };
  }

  /**
   * 审核歌词
   */
  async reviewLyric(lyricId, status, remark) {
    await db.query(
      `UPDATE lyrics SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, lyricId]
    );
  }

  /**
   * 获取音乐详情
   */
  async getSongDetail(songId) {
    const [songs] = await db.query(
      `SELECT s.*, a.name as artist_name, al.title as album_name
       FROM songs s
       INNER JOIN artists a ON s.artist_id = a.id
       LEFT JOIN albums al ON s.album_id = al.id
       WHERE s.id = ?`,
      [songId]
    );

    if (songs.length === 0) {
      throw new Error('音乐不存在');
    }

    const song = songs[0];

    // 获取类型
    const [genres] = await db.query(
      `SELECT g.id, g.name
       FROM genres g
       INNER JOIN song_genres sg ON g.id = sg.genre_id
       WHERE sg.song_id = ?`,
      [songId]
    );

    // 获取统计数据
    const [stats] = await db.query(
      `SELECT 
        (SELECT COUNT(*) FROM user_favorites WHERE song_id = ?) as favorite_count,
        (SELECT COUNT(*) FROM comments WHERE song_id = ?) as comment_count,
        (SELECT AVG(rating) FROM ratings WHERE song_id = ?) as rating
       FROM dual`,
      [songId, songId, songId]
    );

    return {
      ...song,
      genres: genres.map(g => g.name),
      favorite_count: stats[0].favorite_count || 0,
      comment_count: stats[0].comment_count || 0,
      rating: stats[0].rating ? parseFloat(stats[0].rating).toFixed(1) : null
    };
  }

  /**
   * 上架/下架音乐
   */
  async updateSongStatus(songId, status) {
    await db.query(
      `UPDATE songs SET status = ? WHERE id = ?`,
      [status, songId]
    );
    return { songId, status };
  }

  /**
   * 批量操作音乐
   */
  async batchOperateSongs(ids, action, data = {}) {
    const connection = await db.getConnection();
    let successCount = 0;
    let failCount = 0;

    try {
      await connection.beginTransaction();

      for (const id of ids) {
        try {
          switch (action) {
            case 'delete':
              await connection.query(`UPDATE songs SET status = 0 WHERE id = ?`, [id]);
              break;
            case 'online':
              await connection.query(`UPDATE songs SET status = 1 WHERE id = ?`, [id]);
              break;
            case 'offline':
              await connection.query(`UPDATE songs SET status = 0 WHERE id = ?`, [id]);
              break;
            case 'update_genre':
              if (data.genreIds && data.genreIds.length > 0) {
                await connection.query(`DELETE FROM song_genres WHERE song_id = ?`, [id]);
                const genreValues = data.genreIds.map(genreId => [id, genreId]);
                await connection.query(
                  `INSERT INTO song_genres (song_id, genre_id) VALUES ?`,
                  [genreValues]
                );
              }
              break;
            default:
              throw new Error(`未知的操作类型: ${action}`);
          }
          successCount++;
        } catch (error) {
          failCount++;
          console.error(`操作音乐 ${id} 失败:`, error.message);
        }
      }

      await connection.commit();
      return { success_count: successCount, fail_count: failCount };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 获取数据统计
   */
  async getStatistics() {
    const [userStats] = await db.query(`SELECT COUNT(*) as total FROM users WHERE status = 1`);
    const [todayUsers] = await db.query(
      `SELECT COUNT(*) as total FROM users WHERE DATE(created_at) = CURDATE()`
    );
    const [songStats] = await db.query(`SELECT COUNT(*) as total FROM songs WHERE status = 1`);
    const [todaySongs] = await db.query(
      `SELECT COUNT(*) as total FROM songs WHERE DATE(created_at) = CURDATE()`
    );
    const [playStats] = await db.query(`SELECT SUM(play_count) as total FROM songs`);
    const [todayPlays] = await db.query(
      `SELECT SUM(play_count) as total FROM song_stats_daily WHERE stat_date = CURDATE()`
    );
    const [commentStats] = await db.query(`SELECT COUNT(*) as total FROM comments WHERE status = 1`);
    const [todayComments] = await db.query(
      `SELECT COUNT(*) as total FROM comments WHERE DATE(created_at) = CURDATE()`
    );
    const [playlistStats] = await db.query(`SELECT COUNT(*) as total FROM playlists`);
    const [todayPlaylists] = await db.query(
      `SELECT COUNT(*) as total FROM playlists WHERE DATE(created_at) = CURDATE()`
    );
    
    return {
      totalUsers: userStats[0].total,
      todayNewUsers: todayUsers[0].total,
      totalSongs: songStats[0].total,
      todayNewSongs: todaySongs[0].total,
      totalPlayback: playStats[0].total || 0,
      todayPlayback: todayPlays[0].total || 0,
      totalComments: commentStats[0].total,
      todayNewComments: todayComments[0].total,
      totalPlaylists: playlistStats[0].total,
      todayNewPlaylists: todayPlaylists[0].total
    };
  }

  /**
   * 获取管理员信息
   */
  async getAdminInfo(adminId) {
    const [admins] = await db.query(
      `SELECT id, username, email, role, last_login_at, created_at
       FROM admins WHERE id = ? AND status = 1`,
      [adminId]
    );

    if (admins.length === 0) {
      throw new Error('管理员不存在');
    }

    return admins[0];
  }

  // ==================== 专辑管理 ====================

  /**
   * 获取专辑列表
   */
  async getAlbumList({ page = 1, pageSize = 20, keyword, artist_id }) {
    const offset = (page - 1) * pageSize;
    const conditions = [];
    const params = [];

    if (keyword) {
      conditions.push('(al.title LIKE ? OR a.name LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (artist_id) {
      conditions.push('al.artist_id = ?');
      params.push(artist_id);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(pageSize, offset);

    const [rows] = await db.query(
      `SELECT al.*, a.name as artist_name,
              (SELECT COUNT(*) FROM songs WHERE album_id = al.id) as song_count
       FROM albums al
       INNER JOIN artists a ON al.artist_id = a.id
       ${whereClause}
       ORDER BY al.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );

    const countParams = params.slice(0, -2);
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM albums al ${whereClause}`,
      countParams
    );

    return {
      list: rows,
      total: countRows[0].total
    };
  }

  /**
   * 获取专辑详情
   */
  async getAlbumDetail(albumId) {
    const [albums] = await db.query(
      `SELECT al.*, a.name as artist_name
       FROM albums al
       INNER JOIN artists a ON al.artist_id = a.id
       WHERE al.id = ?`,
      [albumId]
    );

    if (albums.length === 0) {
      throw new Error('专辑不存在');
    }

    const album = albums[0];

    // 获取专辑包含的音乐
    const [songs] = await db.query(
      `SELECT s.id, s.title, s.duration, s.cover_url
       FROM songs s
       WHERE s.album_id = ?
       ORDER BY s.created_at ASC`,
      [albumId]
    );

    return {
      ...album,
      songs,
      song_count: songs.length
    };
  }

  /**
   * 创建专辑
   */
  async createAlbum(data) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `INSERT INTO albums (title, artist_id, cover_url, release_date, description, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [data.title, data.artist_id, data.cover_url, data.release_date, data.description, data.status || 1]
      );

      const albumId = result.insertId;

      // 添加音乐到专辑
      if (data.song_ids && data.song_ids.length > 0) {
        await connection.query(
          `UPDATE songs SET album_id = ? WHERE id IN (?)`,
          [albumId, data.song_ids]
        );
      }

      await connection.commit();
      return { albumId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 更新专辑
   */
  async updateAlbum(albumId, data) {
    const allowedFields = ['title', 'artist_id', 'cover_url', 'release_date', 'description', 'status'];
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

    values.push(albumId);

    await db.query(
      `UPDATE albums SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    // 更新专辑包含的音乐
    if (data.song_ids !== undefined) {
      // 先清除原有关联
      await db.query(`UPDATE songs SET album_id = NULL WHERE album_id = ?`, [albumId]);
      // 设置新的关联
      if (data.song_ids.length > 0) {
        await db.query(
          `UPDATE songs SET album_id = ? WHERE id IN (?)`,
          [albumId, data.song_ids]
        );
      }
    }

    return await this.getAlbumDetail(albumId);
  }

  /**
   * 删除专辑
   */
  async deleteAlbum(albumId) {
    // 先清除音乐与专辑的关联
    await db.query(`UPDATE songs SET album_id = NULL WHERE album_id = ?`, [albumId]);
    // 删除专辑
    await db.query(`DELETE FROM albums WHERE id = ?`, [albumId]);
  }

  // ==================== 歌词管理 ====================

  /**
   * 上传官方歌词
   */
  async createLyric(data) {
    // 检查是否已存在该歌曲的歌词
    const [existing] = await db.query(
      `SELECT id FROM lyrics WHERE song_id = ? AND language = ?`,
      [data.song_id, data.language || 'zh']
    );

    if (existing.length > 0) {
      // 更新现有歌词
      await db.query(
        `UPDATE lyrics SET lrc_content = ? WHERE id = ?`,
        [data.content, existing[0].id]
      );
      return { lyricId: existing[0].id };
    } else {
      // 创建新歌词
      const [result] = await db.query(
        `INSERT INTO lyrics (song_id, language, lrc_content)
         VALUES (?, ?, ?)`,
        [data.song_id, data.language || 'zh', data.content]
      );
      return { lyricId: result.insertId };
    }
  }

  /**
   * 删除歌词
   */
  async deleteLyric(lyricId) {
    await db.query(`DELETE FROM lyrics WHERE id = ?`, [lyricId]);
  }

  // ==================== 用户管理 ====================

  /**
   * 获取用户列表
   */
  async getUserList({ page = 1, pageSize = 20, keyword, status }) {
    const offset = (page - 1) * pageSize;
    const conditions = [];
    const params = [];

    if (keyword) {
      conditions.push('(u.username LIKE ? OR u.nickname LIKE ? OR u.email LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (status !== undefined) {
      conditions.push('u.status = ?');
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(pageSize, offset);

    const [rows] = await db.query(
      `SELECT u.id, u.username, u.nickname, u.email, u.avatar, u.status,
              u.created_at, u.last_login_at
       FROM users u
       ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );

    const countParams = params.slice(0, -2);
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM users u ${whereClause}`,
      countParams
    );

    return {
      list: rows,
      total: countRows[0].total
    };
  }

  /**
   * 获取用户详情
   */
  async getUserDetail(userId) {
    const [users] = await db.query(
      `SELECT * FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      throw new Error('用户不存在');
    }

    const user = users[0];

    // 获取统计数据
    const [stats] = await db.query(
      `SELECT 
        (SELECT COUNT(*) FROM play_history WHERE user_id = ?) as play_count,
        (SELECT COUNT(*) FROM user_favorites WHERE user_id = ?) as favorite_count,
        (SELECT COUNT(*) FROM playlists WHERE user_id = ?) as playlist_count,
        (SELECT COUNT(*) FROM comments WHERE user_id = ?) as comment_count
       FROM dual`,
      [userId, userId, userId, userId]
    );

    // 获取创建的歌单
    const [playlists] = await db.query(
      `SELECT id, name, cover_url, song_count, play_count, favorite_count
       FROM playlists WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`,
      [userId]
    );

    // 获取收藏的音乐
    const [favorites] = await db.query(
      `SELECT s.id, s.title, s.artist_id, a.name as artist_name, s.cover_url
       FROM user_favorites uf
       INNER JOIN songs s ON uf.song_id = s.id
       INNER JOIN artists a ON s.artist_id = a.id
       WHERE uf.user_id = ? ORDER BY uf.created_at DESC LIMIT 10`,
      [userId]
    );

    return {
      ...user,
      statistics: {
        play_count: stats[0].play_count || 0,
        favorite_count: stats[0].favorite_count || 0,
        playlist_count: stats[0].playlist_count || 0,
        comment_count: stats[0].comment_count || 0
      },
      playlists,
      favorites
    };
  }

  /**
   * 更新用户状态
   */
  async updateUserStatus(userId, status) {
    await db.query(
      `UPDATE users SET status = ? WHERE id = ?`,
      [status, userId]
    );
    return { userId, status };
  }

  /**
   * 重置用户密码
   */
  async resetUserPassword(userId) {
    // 生成重置Token（这里简化处理，实际应该发送邮件）
    const resetToken = jwt.sign(
      { userId, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 获取用户邮箱
    const [users] = await db.query(`SELECT email FROM users WHERE id = ?`, [userId]);
    const userEmail = users.length > 0 ? users[0].email : '';

    // 这里应该发送邮件，暂时只返回token
    return {
      reset_token: resetToken,
      email: userEmail,
      message: '密码重置链接已生成，请发送到用户邮箱'
    };
  }

  /**
   * 删除用户
   */
  async deleteUser(userId) {
    // 软删除
    await db.query(`UPDATE users SET status = 0 WHERE id = ?`, [userId]);
  }

  // ==================== 评论管理 ====================

  /**
   * 获取评论列表
   */
  async getCommentList({ page = 1, pageSize = 20, keyword, review_status, song_id }) {
    const offset = (page - 1) * pageSize;
    const conditions = [];
    const params = [];

    if (keyword) {
      conditions.push('(c.content LIKE ? OR s.title LIKE ? OR u.username LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (review_status !== undefined) {
      if (review_status === 'normal') {
        conditions.push('c.status = 1');
      } else if (review_status === 'deleted') {
        conditions.push('c.status = 0');
      } else if (review_status === 'pending') {
        // 假设有审核状态字段，这里简化处理
        conditions.push('c.status = 1');
      }
    }

    if (song_id) {
      conditions.push('c.song_id = ?');
      params.push(song_id);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(pageSize, offset);

    const [rows] = await db.query(
      `SELECT c.*, s.title as song_title, u.username, u.nickname,
              (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as like_count,
              (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) as reply_count
       FROM comments c
       INNER JOIN songs s ON c.song_id = s.id
       INNER JOIN users u ON c.user_id = u.id
       ${whereClause}
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );

    const countParams = params.slice(0, -2);
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM comments c ${whereClause}`,
      countParams
    );

    return {
      list: rows,
      total: countRows[0].total
    };
  }

  /**
   * 获取评论详情
   */
  async getCommentDetail(commentId) {
    const [comments] = await db.query(
      `SELECT c.*, s.title as song_title, s.id as song_id,
              u.id as user_id, u.username, u.nickname, u.avatar
       FROM comments c
       INNER JOIN songs s ON c.song_id = s.id
       INNER JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [commentId]
    );

    if (comments.length === 0) {
      throw new Error('评论不存在');
    }

    const comment = comments[0];

    // 获取回复
    const [replies] = await db.query(
      `SELECT c.*, u.username, u.nickname, u.avatar
       FROM comments c
       INNER JOIN users u ON c.user_id = u.id
       WHERE c.parent_id = ?
       ORDER BY c.created_at ASC`,
      [commentId]
    );

    // 获取点赞用户
    const [likes] = await db.query(
      `SELECT u.id, u.username, u.nickname
       FROM comment_likes cl
       INNER JOIN users u ON cl.user_id = u.id
       WHERE cl.comment_id = ?`,
      [commentId]
    );

    return {
      ...comment,
      replies,
      likes
    };
  }

  /**
   * 审核评论
   */
  async reviewComment(commentId, status) {
    // status: 'normal' = 1, 'deleted' = 0
    const commentStatus = status === 'normal' ? 1 : 0;
    await db.query(
      `UPDATE comments SET status = ? WHERE id = ?`,
      [commentStatus, commentId]
    );
  }

  /**
   * 删除评论
   */
  async deleteComment(commentId) {
    // 删除评论及其回复和点赞
    await db.query(`UPDATE comments SET status = 0 WHERE id = ? OR parent_id = ?`, [commentId, commentId]);
    await db.query(`DELETE FROM comment_likes WHERE comment_id = ?`, [commentId]);
  }

  // ==================== 歌单管理 ====================

  /**
   * 获取歌单列表
   */
  async getPlaylistList({ page = 1, pageSize = 20, keyword, is_public, user_id }) {
    const offset = (page - 1) * pageSize;
    const conditions = [];
    const params = [];

    if (keyword) {
      conditions.push('(p.name LIKE ? OR u.username LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (is_public !== undefined) {
      conditions.push('p.is_public = ?');
      params.push(is_public);
    }

    if (user_id) {
      conditions.push('p.user_id = ?');
      params.push(user_id);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(pageSize, offset);

    const [rows] = await db.query(
      `SELECT p.*, u.username as creator,
              (SELECT COUNT(*) FROM playlist_songs WHERE playlist_id = p.id) as song_count,
              (SELECT COUNT(*) FROM playlist_favorites WHERE playlist_id = p.id) as favorite_count
       FROM playlists p
       INNER JOIN users u ON p.user_id = u.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );

    const countParams = params.slice(0, -2);
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
  async getPlaylistDetail(playlistId) {
    const [playlists] = await db.query(
      `SELECT p.*, u.username as creator, u.id as user_id
       FROM playlists p
       INNER JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [playlistId]
    );

    if (playlists.length === 0) {
      throw new Error('歌单不存在');
    }

    const playlist = playlists[0];

    // 获取歌单包含的音乐
    const [songs] = await db.query(
      `SELECT s.id, s.title, s.artist_id, a.name as artist_name,
              s.duration, s.cover_url, ps.order
       FROM playlist_songs ps
       INNER JOIN songs s ON ps.song_id = s.id
       INNER JOIN artists a ON s.artist_id = a.id
       WHERE ps.playlist_id = ?
       ORDER BY ps.order ASC`,
      [playlistId]
    );

    return {
      ...playlist,
      songs,
      song_count: songs.length
    };
  }

  /**
   * 更新歌单
   */
  async updatePlaylist(playlistId, data) {
    const allowedFields = ['name', 'description', 'cover_url', 'is_public'];
    const updateFields = [];
    const values = [];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        values.push(data[field]);
      }
    });

    if (updateFields.length > 0) {
      values.push(playlistId);
      await db.query(
        `UPDATE playlists SET ${updateFields.join(', ')} WHERE id = ?`,
        values
      );
    }

    // 更新歌单包含的音乐
    if (data.song_ids !== undefined) {
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();
        // 删除原有关联
        await connection.query(`DELETE FROM playlist_songs WHERE playlist_id = ?`, [playlistId]);
        // 添加新关联
        if (data.song_ids.length > 0) {
          const songValues = data.song_ids.map((songId, index) => [playlistId, songId, index + 1]);
          await connection.query(
            `INSERT INTO playlist_songs (playlist_id, song_id, \`order\`) VALUES ?`,
            [songValues]
          );
        }
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    }

    return await this.getPlaylistDetail(playlistId);
  }

  /**
   * 删除歌单
   */
  async deletePlaylist(playlistId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      // 删除关联数据
      await connection.query(`DELETE FROM playlist_songs WHERE playlist_id = ?`, [playlistId]);
      await connection.query(`DELETE FROM playlist_favorites WHERE playlist_id = ?`, [playlistId]);
      // 删除歌单
      await connection.query(`DELETE FROM playlists WHERE id = ?`, [playlistId]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // ==================== 数据统计 ====================

  /**
   * 获取用户统计
   */
  async getUserStatistics({ start_date, end_date, period = 'day' }) {
    // 总用户数
    const [totalUsers] = await db.query(`SELECT COUNT(*) as total FROM users WHERE status = 1`);
    const [todayNew] = await db.query(
      `SELECT COUNT(*) as total FROM users WHERE DATE(created_at) = CURDATE()`
    );
    const [yesterdayNew] = await db.query(
      `SELECT COUNT(*) as total FROM users WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`
    );
    const [weekNew] = await db.query(
      `SELECT COUNT(*) as total FROM users WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
    );
    const [monthNew] = await db.query(
      `SELECT COUNT(*) as total FROM users WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
    );

    // 用户增长趋势
    const [growthTrend] = await db.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM users
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    // 活跃用户
    const [dailyActive] = await db.query(
      `SELECT COUNT(DISTINCT user_id) as count FROM play_history WHERE DATE(created_at) = CURDATE()`
    );
    const [weeklyActive] = await db.query(
      `SELECT COUNT(DISTINCT user_id) as count FROM play_history WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
    );
    const [monthlyActive] = await db.query(
      `SELECT COUNT(DISTINCT user_id) as count FROM play_history WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
    );

    return {
      total: totalUsers[0].total,
      today_new: todayNew[0].total,
      yesterday_new: yesterdayNew[0].total,
      week_new: weekNew[0].total,
      month_new: monthNew[0].total,
      growth_trend: growthTrend,
      active_users: {
        daily: dailyActive[0].count || 0,
        weekly: weeklyActive[0].count || 0,
        monthly: monthlyActive[0].count || 0
      }
    };
  }

  /**
   * 获取音乐统计
   */
  async getSongStatistics({ start_date, end_date }) {
    const [total] = await db.query(`SELECT COUNT(*) as total FROM songs WHERE status = 1`);
    const [todayNew] = await db.query(
      `SELECT COUNT(*) as total FROM songs WHERE DATE(created_at) = CURDATE()`
    );
    const [yesterdayNew] = await db.query(
      `SELECT COUNT(*) as total FROM songs WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`
    );
    const [weekNew] = await db.query(
      `SELECT COUNT(*) as total FROM songs WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
    );
    const [monthNew] = await db.query(
      `SELECT COUNT(*) as total FROM songs WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
    );

    // 类型分布
    const [genreDist] = await db.query(
      `SELECT g.name as genre, COUNT(*) as count
       FROM song_genres sg
       INNER JOIN genres g ON sg.genre_id = g.id
       GROUP BY g.id, g.name
       ORDER BY count DESC`
    );

    // 热门音乐TOP20
    const [topSongs] = await db.query(
      `SELECT s.id, s.title, a.name as artist_name, s.play_count,
              COALESCE(fav.favorite_count, 0) as favorite_count,
              COALESCE(rat.rating, 0) as rating
       FROM songs s
       INNER JOIN artists a ON s.artist_id = a.id
       LEFT JOIN (
         SELECT song_id, COUNT(*) as favorite_count
         FROM user_favorites
         GROUP BY song_id
       ) fav ON fav.song_id = s.id
       LEFT JOIN (
         SELECT song_id, AVG(score) as rating
         FROM ratings
         GROUP BY song_id
       ) rat ON rat.song_id = s.id
       WHERE s.status = 1
       ORDER BY s.play_count DESC
       LIMIT 20`
    );

    // 播放趋势
    const [playTrend] = await db.query(
      `SELECT stat_date as date, SUM(play_count) as count
       FROM song_stats_daily
       WHERE stat_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY stat_date
       ORDER BY stat_date ASC`
    );

    return {
      total: total[0].total,
      today_new: todayNew[0].total,
      yesterday_new: yesterdayNew[0].total,
      week_new: weekNew[0].total,
      month_new: monthNew[0].total,
      genre_distribution: genreDist,
      top_songs: topSongs,
      play_trend: playTrend
    };
  }

  /**
   * 获取播放统计
   */
  async getPlaybackStatistics({ start_date, end_date }) {
    const [total] = await db.query(`SELECT SUM(play_count) as total FROM songs`);
    const [today] = await db.query(
      `SELECT SUM(play_count) as total FROM song_stats_daily WHERE stat_date = CURDATE()`
    );
    const [yesterday] = await db.query(
      `SELECT SUM(play_count) as total FROM song_stats_daily WHERE stat_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`
    );
    const [week] = await db.query(
      `SELECT SUM(play_count) as total FROM song_stats_daily WHERE stat_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
    );
    const [month] = await db.query(
      `SELECT SUM(play_count) as total FROM song_stats_daily WHERE stat_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
    );

    // 播放趋势
    const [trend] = await db.query(
      `SELECT stat_date as date, SUM(play_count) as count
       FROM song_stats_daily
       WHERE stat_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY stat_date
       ORDER BY stat_date ASC`
    );

    // 时段分布
    let hourlyDist = [];
    try {
      const [result] = await db.query(
        `SELECT HOUR(played_at) as hour, COUNT(*) as count
         FROM play_history
         WHERE played_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
         GROUP BY HOUR(played_at)
         ORDER BY hour ASC`
      );
      hourlyDist = result;
    } catch (error) {
      // 如果表不存在或字段名不同，返回空数组
      console.warn('获取时段分布失败:', error.message);
    }

    return {
      total: total[0].total || 0,
      today: today[0].total || 0,
      yesterday: yesterday[0].total || 0,
      week: week[0].total || 0,
      month: month[0].total || 0,
      trend,
      hourly_distribution: hourlyDist
    };
  }

  /**
   * 获取推荐统计
   */
  async getRecommendStatistics({ start_date, end_date }) {
    // 这里简化处理，实际应该从推荐系统获取数据
    return {
      accuracy: 0.85,
      coverage: 0.70,
      ctr: 0.15,
      conversion_rate: 0.30,
      satisfaction: 4.5,
      trend: []
    };
  }

  // ==================== 操作日志 ====================

  /**
   * 记录操作日志
   */
  async logAction(adminId, actionType, targetType, targetId, actionContent, ipAddress, userAgent) {
    try {
      await db.query(
        `INSERT INTO admin_logs (admin_id, action_type, target_type, target_id, action_content, ip_address, user_agent, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [adminId, actionType, targetType, targetId, actionContent, ipAddress, userAgent]
      );
    } catch (error) {
      // 如果表不存在，忽略错误（开发阶段）
      console.warn('记录操作日志失败:', error.message);
    }
  }

  /**
   * 获取操作日志列表
   */
  async getLogList({ page = 1, pageSize = 20, keyword, admin_id, action_type, target_type, start_date, end_date }) {
    try {
      const offset = (page - 1) * pageSize;
      const conditions = [];
      const params = [];

      if (keyword) {
        conditions.push('al.action_content LIKE ?');
        params.push(`%${keyword}%`);
      }

      if (admin_id) {
        conditions.push('al.admin_id = ?');
        params.push(admin_id);
      }

      if (action_type) {
        conditions.push('al.action_type = ?');
        params.push(action_type);
      }

      if (target_type) {
        conditions.push('al.target_type = ?');
        params.push(target_type);
      }

      if (start_date) {
        conditions.push('DATE(al.created_at) >= ?');
        params.push(start_date);
      }

      if (end_date) {
        conditions.push('DATE(al.created_at) <= ?');
        params.push(end_date);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      params.push(pageSize, offset);

      const [rows] = await db.query(
        `SELECT al.*, a.username as admin_name
         FROM admin_logs al
         LEFT JOIN admins a ON al.admin_id = a.id
         ${whereClause}
         ORDER BY al.created_at DESC
         LIMIT ? OFFSET ?`,
        params
      );

      const countParams = params.slice(0, -2);
      const [countRows] = await db.query(
        `SELECT COUNT(*) as total FROM admin_logs al ${whereClause}`,
        countParams
      );

      return {
        list: rows,
        total: countRows[0].total
      };
    } catch (error) {
      // 如果表不存在，返回空列表
      if (error.message.includes("doesn't exist") || error.message.includes('Unknown table')) {
        return { list: [], total: 0 };
      }
      throw error;
    }
  }

  /**
   * 获取日志详情
   */
  async getLogDetail(logId) {
    try {
      const [logs] = await db.query(
        `SELECT al.*, a.username as admin_name, a.email as admin_email
         FROM admin_logs al
         LEFT JOIN admins a ON al.admin_id = a.id
         WHERE al.id = ?`,
        [logId]
      );

      if (logs.length === 0) {
        throw new Error('日志不存在');
      }

      return logs[0];
    } catch (error) {
      if (error.message.includes("doesn't exist") || error.message.includes('Unknown table')) {
        throw new Error('操作日志表不存在');
      }
      throw error;
    }
  }
}

module.exports = new AdminService();

