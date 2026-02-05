/**
 * Mock 用户数据初始化脚本
 * 
 * 使用方法：
 * node migrations/init_mock_users.js
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../config/database');
const logger = require('../utils/logger');

// 测试用户数据
const testUsers = [
  {
    username: 'testuser1',
    password: 'Test123456',
    email: 'test1@example.com',
    nickname: '测试用户1',
    gender: 1
  },
  {
    username: 'testuser2',
    password: 'Test123456',
    email: 'test2@example.com',
    nickname: '测试用户2',
    gender: 2
  },
  {
    username: 'testuser3',
    password: 'Test123456',
    email: 'test3@example.com',
    nickname: '测试用户3',
    gender: 0
  },
  {
    username: 'demo',
    password: 'Demo123456',
    email: 'demo@example.com',
    nickname: '演示用户',
    gender: 1
  }
];

// 管理员数据
const admins = [
  {
    username: 'admin',
    password: 'Admin123456',
    email: 'admin@greenmusic.com',
    nickname: '系统管理员',
    role: 'super_admin'
  },
  {
    username: 'operator',
    password: 'Operator123456',
    email: 'operator@greenmusic.com',
    nickname: '运营管理员',
    role: 'admin'
  }
];

/**
 * 初始化用户数据
 */
async function initUsers() {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    logger.info('开始初始化用户数据...');
    
    for (const user of testUsers) {
      // 检查用户是否已存在
      const [existing] = await connection.query(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [user.username, user.email]
      );
      
      if (existing.length > 0) {
        logger.info(`用户 ${user.username} 已存在，跳过`);
        continue;
      }
      
      // 加密密码
      const passwordHash = await bcrypt.hash(user.password, 10);
      
      // 插入用户
      const [result] = await connection.query(
        `INSERT INTO users (username, password_hash, email, nickname, gender, status) 
         VALUES (?, ?, ?, ?, ?, 1)`,
        [user.username, passwordHash, user.email, user.nickname, user.gender]
      );
      
      const userId = result.insertId;
      
      // 初始化通知设置
      await connection.query(
        'INSERT INTO notification_settings (user_id) VALUES (?)',
        [userId]
      );
      
      logger.info(`✓ 创建用户: ${user.username} (ID: ${userId})`);
    }
    
    await connection.commit();
    logger.info('用户数据初始化完成');
    
    return true;
  } catch (error) {
    await connection.rollback();
    logger.error('用户数据初始化失败:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 初始化管理员数据
 */
async function initAdmins() {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    logger.info('开始初始化管理员数据...');
    
    for (const admin of admins) {
      // 检查管理员是否已存在
      const [existing] = await connection.query(
        'SELECT id FROM admins WHERE username = ? OR email = ?',
        [admin.username, admin.email]
      );
      
      if (existing.length > 0) {
        logger.info(`管理员 ${admin.username} 已存在，跳过`);
        continue;
      }
      
      // 加密密码
      const passwordHash = await bcrypt.hash(admin.password, 10);
      
      // 插入管理员
      const [result] = await connection.query(
        `INSERT INTO admins (username, password_hash, email, nickname, role, status) 
         VALUES (?, ?, ?, ?, ?, 1)`,
        [admin.username, passwordHash, admin.email, admin.nickname, admin.role, 1]
      );
      
      logger.info(`✓ 创建管理员: ${admin.username} (ID: ${result.insertId})`);
    }
    
    await connection.commit();
    logger.info('管理员数据初始化完成');
    
    return true;
  } catch (error) {
    await connection.rollback();
    logger.error('管理员数据初始化失败:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 初始化歌单数据
 */
async function initPlaylists() {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    logger.info('开始初始化歌单数据...');
    
    // 获取用户ID
    const [users] = await connection.query('SELECT id FROM users LIMIT 3');
    if (users.length === 0) {
      logger.warn('没有用户数据，跳过歌单初始化');
      await connection.rollback();
      return;
    }
    
    const playlists = [
      {
        user_id: users[0].id,
        name: '我的最爱',
        description: '我最喜欢的歌曲合集',
        is_public: 1
      },
      {
        user_id: users[0].id,
        name: '工作时的音乐',
        description: '适合工作时听的轻音乐',
        is_public: 1
      },
      {
        user_id: users[1].id,
        name: '经典老歌',
        description: '那些年我们一起听过的歌',
        is_public: 1
      },
      {
        user_id: users[1].id,
        name: '私人收藏',
        description: '我的私人歌单',
        is_public: 0
      }
    ];
    
    // 获取歌曲ID
    const [songs] = await connection.query('SELECT id FROM songs ORDER BY id LIMIT 20');
    
    for (const playlist of playlists) {
      // 检查歌单是否已存在
      const [existing] = await connection.query(
        'SELECT id FROM playlists WHERE user_id = ? AND name = ?',
        [playlist.user_id, playlist.name]
      );
      
      if (existing.length > 0) {
        logger.info(`歌单 ${playlist.name} 已存在，跳过`);
        continue;
      }
      
      // 插入歌单
      const [result] = await connection.query(
        `INSERT INTO playlists (user_id, name, description, is_public, status) 
         VALUES (?, ?, ?, ?, 1)`,
        [playlist.user_id, playlist.name, playlist.description, playlist.is_public]
      );
      
      const playlistId = result.insertId;
      
      // 添加歌曲到歌单（每个歌单添加5-10首歌曲）
      const songCount = Math.floor(Math.random() * 6) + 5; // 5-10首
      const selectedSongs = songs.slice(0, Math.min(songCount, songs.length));
      
      for (let i = 0; i < selectedSongs.length; i++) {
        await connection.query(
          'INSERT INTO playlist_songs (playlist_id, song_id, sort_order) VALUES (?, ?, ?)',
          [playlistId, selectedSongs[i].id, i + 1]
        );
      }
      
      // 更新歌单歌曲数量
      await connection.query(
        'UPDATE playlists SET song_count = ? WHERE id = ?',
        [selectedSongs.length, playlistId]
      );
      
      logger.info(`✓ 创建歌单: ${playlist.name} (ID: ${playlistId}, 歌曲数: ${selectedSongs.length})`);
    }
    
    await connection.commit();
    logger.info('歌单数据初始化完成');
    
    return true;
  } catch (error) {
    await connection.rollback();
    logger.error('歌单数据初始化失败:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 初始化评论数据
 */
async function initComments() {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    logger.info('开始初始化评论数据...');
    
    // 获取用户和歌曲
    const [users] = await connection.query('SELECT id FROM users LIMIT 3');
    const [songs] = await connection.query('SELECT id FROM songs ORDER BY id LIMIT 10');
    
    if (users.length === 0 || songs.length === 0) {
      logger.warn('缺少用户或歌曲数据，跳过评论初始化');
      await connection.rollback();
      return;
    }
    
    const comments = [
      { user_id: users[0].id, song_id: songs[0].id, content: '这首歌太好听了！' },
      { user_id: users[1].id, song_id: songs[0].id, content: '经典老歌，百听不厌' },
      { user_id: users[0].id, song_id: songs[1].id, content: '歌词写得真好' },
      { user_id: users[2].id, song_id: songs[1].id, content: '推荐给朋友们' },
      { user_id: users[1].id, song_id: songs[2].id, content: '单曲循环中...' }
    ];
    
    for (const comment of comments) {
      // 检查是否已存在相同评论
      const [existing] = await connection.query(
        'SELECT id FROM comments WHERE user_id = ? AND song_id = ? AND content = ?',
        [comment.user_id, comment.song_id, comment.content]
      );
      
      if (existing.length > 0) {
        continue;
      }
      
      const [result] = await connection.query(
        'INSERT INTO comments (user_id, song_id, content, status) VALUES (?, ?, ?, 1)',
        [comment.user_id, comment.song_id, comment.content]
      );
      
      logger.info(`✓ 创建评论: 用户${comment.user_id} 对歌曲${comment.song_id}`);
    }
    
    await connection.commit();
    logger.info('评论数据初始化完成');
    
    return true;
  } catch (error) {
    await connection.rollback();
    logger.error('评论数据初始化失败:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 初始化评分数据
 */
async function initRatings() {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    logger.info('开始初始化评分数据...');
    
    const [users] = await connection.query('SELECT id FROM users LIMIT 3');
    const [songs] = await connection.query('SELECT id FROM songs ORDER BY id LIMIT 15');
    
    if (users.length === 0 || songs.length === 0) {
      logger.warn('缺少用户或歌曲数据，跳过评分初始化');
      await connection.rollback();
      return;
    }
    
    // 为每首歌曲随机分配1-3个用户的评分
    for (const song of songs) {
      const userCount = Math.floor(Math.random() * 3) + 1; // 1-3个用户
      const selectedUsers = users.slice(0, Math.min(userCount, users.length));
      
      for (const user of selectedUsers) {
        // 检查是否已评分
        const [existing] = await connection.query(
          'SELECT id FROM ratings WHERE user_id = ? AND song_id = ?',
          [user.id, song.id]
        );
        
        if (existing.length > 0) {
          continue;
        }
        
        // 随机评分 3-5 分
        const score = Math.floor(Math.random() * 3) + 3;
        
        await connection.query(
          'INSERT INTO ratings (user_id, song_id, score) VALUES (?, ?, ?)',
          [user.id, song.id, score]
        );
      }
    }
    
    await connection.commit();
    logger.info('评分数据初始化完成');
    
    return true;
  } catch (error) {
    await connection.rollback();
    logger.error('评分数据初始化失败:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 初始化播放历史数据
 */
async function initPlayHistory() {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    logger.info('开始初始化播放历史数据...');
    
    const [users] = await connection.query('SELECT id FROM users LIMIT 3');
    const [songs] = await connection.query('SELECT id FROM songs ORDER BY id LIMIT 20');
    
    if (users.length === 0 || songs.length === 0) {
      logger.warn('缺少用户或歌曲数据，跳过播放历史初始化');
      await connection.rollback();
      return;
    }
    
    // 为每个用户生成播放历史
    for (const user of users) {
      const historyCount = Math.floor(Math.random() * 10) + 5; // 5-15条记录
      const selectedSongs = songs.slice(0, Math.min(historyCount, songs.length));
      
      for (let i = 0; i < selectedSongs.length; i++) {
        // 生成过去30天内的随机时间
        const daysAgo = Math.floor(Math.random() * 30);
        const hoursAgo = Math.floor(Math.random() * 24);
        const playedAt = new Date();
        playedAt.setDate(playedAt.getDate() - daysAgo);
        playedAt.setHours(playedAt.getHours() - hoursAgo);
        
        // 随机播放时长（30秒到完整时长）
        const duration = Math.floor(Math.random() * 200) + 30;
        
        await connection.query(
          'INSERT INTO play_history (user_id, song_id, played_at, duration_sec) VALUES (?, ?, ?, ?)',
          [user.id, selectedSongs[i].id, playedAt, duration]
        );
      }
      
      logger.info(`✓ 为用户${user.id}创建${selectedSongs.length}条播放历史`);
    }
    
    await connection.commit();
    logger.info('播放历史数据初始化完成');
    
    return true;
  } catch (error) {
    await connection.rollback();
    logger.error('播放历史数据初始化失败:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    logger.info('========================================');
    logger.info('开始初始化 Mock 数据');
    logger.info('========================================');
    
    // 测试数据库连接
    await db.query('SELECT 1');
    logger.info('数据库连接成功');
    
    // 初始化数据
    await initUsers();
    await initAdmins();
    await initPlaylists();
    await initComments();
    await initRatings();
    await initPlayHistory();
    
    logger.info('========================================');
    logger.info('Mock 数据初始化完成！');
    logger.info('========================================');
    logger.info('');
    logger.info('测试账号：');
    logger.info('  用户名: testuser1, 密码: Test123456');
    logger.info('  用户名: testuser2, 密码: Test123456');
    logger.info('  用户名: demo, 密码: Demo123456');
    logger.info('');
    logger.info('管理员账号：');
    logger.info('  用户名: admin, 密码: Admin123456');
    logger.info('  用户名: operator, 密码: Operator123456');
    logger.info('');
    
    process.exit(0);
  } catch (error) {
    logger.error('初始化失败:', error);
    process.exit(1);
  }
}

// 执行
main();



