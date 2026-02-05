const cron = require('node-cron');
const db = require('../config/database');
const { userBasedRecommend, itemBasedRecommend } = require('../algorithms');
const logger = require('../utils/logger');

/**
 * 合并推荐结果
 */
function mergeRecommendations(userBased, itemBased, limit) {
  const scoreMap = {};
  
  userBased.forEach(item => {
    if (!scoreMap[item.songId]) {
      scoreMap[item.songId] = 0;
    }
    scoreMap[item.songId] += item.predictedRating * 0.6;
  });
  
  itemBased.forEach(item => {
    if (!scoreMap[item.songId]) {
      scoreMap[item.songId] = 0;
    }
    scoreMap[item.songId] += item.predictedRating * 0.4;
  });
  
  return Object.entries(scoreMap)
    .map(([songId, score]) => ({
      songId: Number(songId),
      score
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * 保存推荐结果
 */
async function saveRecommendations(userId, itemType, recommendations) {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // 删除旧推荐
    await connection.query(
      `DELETE FROM recommendation_items WHERE user_id = ? AND item_type = ?`,
      [userId, itemType]
    );
    
    // 插入新推荐
    if (recommendations.length > 0) {
      const values = recommendations.map((rec, index) => [
        userId,
        itemType,
        rec.songId,
        rec.score,
        generateReason(index),
        'v1'
      ]);
      
      await connection.query(
        `INSERT INTO recommendation_items 
         (user_id, item_type, item_id, score, reason, algo_version) 
         VALUES ?`,
        [values]
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

function generateReason(index) {
  if (index < 10) {
    return '基于您的听歌历史推荐';
  } else if (index < 30) {
    return '喜欢这首歌的用户也喜欢';
  } else {
    return '来自您常听的歌手/类型';
  }
}

/**
 * 离线推荐计算任务
 */
async function calculateRecommendations() {
  logger.info('开始计算推荐...');
  
  try {
    // 获取所有活跃用户
    const [users] = await db.query(
      `SELECT id FROM users WHERE status = 1 
       AND last_login_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );
    
    for (const user of users) {
      try {
        const userBasedResults = await userBasedRecommend(user.id, 20, 50);
        const itemBasedResults = await itemBasedRecommend(user.id, 50);
        
        const recommendations = mergeRecommendations(
          userBasedResults,
          itemBasedResults,
          50
        );
        
        await saveRecommendations(user.id, 'song', recommendations);
        
        logger.info(`用户 ${user.id} 推荐计算完成`);
      } catch (error) {
        logger.error(`用户 ${user.id} 推荐计算失败:`, error);
      }
    }
    
    logger.info('推荐计算完成');
  } catch (error) {
    logger.error('推荐计算任务失败:', error);
  }
}

// 定时任务：每天凌晨2点执行
if (process.env.ENABLE_RECOMMEND_WORKER !== 'false') {
  cron.schedule('0 2 * * *', calculateRecommendations);
  logger.info('推荐计算任务已启动（每天凌晨2点执行）');
}

module.exports = { calculateRecommendations };

