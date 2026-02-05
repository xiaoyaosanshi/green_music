const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { ERROR_CODES } = require('../utils/constants');

class CommentService {
  /**
   * 获取评论列表
   */
  async getCommentList(songId, page = 1, pageSize = 20, sort = 'time') {
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 20;
    const offset = (pageNum - 1) * pageSizeNum;
    const limit = pageSizeNum;
    const orderBy = sort === 'hot' ? 'like_count DESC, created_at DESC' : 'created_at DESC';
    
    const [rows] = await db.query(
      `SELECT c.*, u.id as user_id, u.username, u.nickname, u.avatar
       FROM comments c
       INNER JOIN users u ON c.user_id = u.id
       WHERE c.song_id = ? AND c.status = 1 AND c.parent_id = 0
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [parseInt(songId), limit, offset]
    );
    
    // 获取回复
    for (const comment of rows) {
      const [replies] = await db.query(
        `SELECT c.*, u.id as user_id, u.username, u.nickname, u.avatar
         FROM comments c
         INNER JOIN users u ON c.user_id = u.id
         WHERE c.root_id = ? AND c.status = 1
         ORDER BY c.created_at ASC
         LIMIT 5`,
        [comment.id]
      );
      comment.replies = replies;
    }
    
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM comments WHERE song_id = ? AND status = 1 AND parent_id = 0`,
      [songId]
    );
    
    return {
      list: rows,
      total: countRows[0].total
    };
  }

  /**
   * 发表评论
   */
  async createComment(userId, songId, content, parentId = 0) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 1. 获取父评论信息（如果是回复）
      let rootId = 0;
      if (parentId > 0) {
        const [parentComments] = await connection.query(
          `SELECT root_id FROM comments WHERE id = ?`,
          [parentId]
        );
        rootId = parentComments[0]?.root_id || parentId;
      }
      
      // 2. 插入评论
      const [result] = await connection.query(
        `INSERT INTO comments (user_id, song_id, content, parent_id, root_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, songId, content, parentId, rootId || parentId]
      );
      
      const commentId = result.insertId;
      
      // 3. 如果是回复，生成通知事件
      if (parentId > 0) {
        const [parentComment] = await connection.query(
          `SELECT user_id FROM comments WHERE id = ?`,
          [parentId]
        );
        
        if (parentComment.length > 0 && parentComment[0].user_id !== userId) {
          // TODO: 使用 outbox 模式，这里简化处理
          // 实际应该写入 outbox_events 表，由 worker 处理
        }
      }
      
      await connection.commit();
      
      return {
        code: ERROR_CODES.SUCCESS,
        message: '评论成功',
        data: { commentId }
      };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 点赞评论
   */
  async likeComment(userId, commentId) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 1. 检查是否已点赞
      const [existing] = await connection.query(
        `SELECT * FROM comment_likes WHERE comment_id = ? AND user_id = ?`,
        [commentId, userId]
      );
      
      if (existing.length > 0) {
        await connection.rollback();
        return;
      }
      
      // 2. 插入点赞记录
      await connection.query(
        `INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)`,
        [commentId, userId]
      );
      
      // 3. 更新评论点赞数
      await connection.query(
        `UPDATE comments SET like_count = like_count + 1 WHERE id = ?`,
        [commentId]
      );
      
      // 4. 获取评论作者，生成通知事件
      const [comment] = await connection.query(
        `SELECT user_id, song_id FROM comments WHERE id = ?`,
        [commentId]
      );
      
      if (comment.length > 0 && comment[0].user_id !== userId) {
        // TODO: 生成通知事件
      }
      
      await connection.commit();
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 取消点赞
   */
  async unlikeComment(userId, commentId) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      await connection.query(
        `DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?`,
        [commentId, userId]
      );
      
      await connection.query(
        `UPDATE comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = ?`,
        [commentId]
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
   * 删除评论
   */
  async deleteComment(userId, commentId) {
    const [comments] = await db.query(
      `SELECT user_id FROM comments WHERE id = ?`,
      [commentId]
    );
    
    if (comments.length === 0) {
      throw new Error('评论不存在');
    }
    
    if (comments[0].user_id !== userId) {
      throw new Error('无权限删除');
    }
    
    await db.query(
      `UPDATE comments SET status = 0 WHERE id = ?`,
      [commentId]
    );
  }
}

module.exports = new CommentService();

