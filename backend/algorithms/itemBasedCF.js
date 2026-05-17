const { cosineSimilarity } = require('./similarity');
const db = require('../config/database');

/**
 * 基于物品的协同过滤推荐
 */
async function itemBasedRecommend(userId, limit = 20) {
  // 1. 获取所有评分数据
  const [allRatings] = await db.query(
    `SELECT user_id, song_id, rating FROM user_ratings`
  );
  
  // 2. 构建音乐-用户评分矩阵
  const songUserMatrix = {};
  allRatings.forEach(row => {
    if (!songUserMatrix[row.song_id]) {
      songUserMatrix[row.song_id] = {};
    }
    songUserMatrix[row.song_id][row.user_id] = parseFloat(row.rating);
  });
  
  // 3. 获取目标用户已评分的音乐
  const [userRatings] = await db.query(
    `SELECT song_id, rating FROM user_ratings WHERE user_id = ?`,
    [userId]
  );
  
  if (userRatings.length === 0) {
    return [];
  }
  
  // 4. 计算音乐之间的相似度
  const userRatedSongs = userRatings.map(r => r.song_id);
  const allSongIds = Object.keys(songUserMatrix).map(Number);
  const unratedSongs = allSongIds.filter(id => !userRatedSongs.includes(id));
  
  const predictions = {};
  
  unratedSongs.forEach(unratedSongId => {
    let numerator = 0;
    let denominator = 0;
    
    userRatedSongs.forEach(ratedSongId => {
      const similarity = calculateSongSimilarity(
        songUserMatrix[ratedSongId],
        songUserMatrix[unratedSongId]
      );
      
      if (similarity > 0) {
        const userRating = userRatings.find(r => r.song_id === ratedSongId).rating;
        numerator += similarity * userRating;
        denominator += Math.abs(similarity);
      }
    });
    
    if (denominator > 0) {
      predictions[unratedSongId] = numerator / denominator;
    }
  });
  
  // 5. 按预测评分排序
  const recommendations = Object.entries(predictions)
    .map(([songId, score]) => ({
      songId: Number(songId),
      predictedRating: score
    }))
    .sort((a, b) => b.predictedRating - a.predictedRating)
    .slice(0, limit);
  
  return recommendations;
}

/**
 * 计算两个音乐的相似度
 */
function calculateSongSimilarity(ratings1, ratings2) {
  const commonUsers = Object.keys(ratings1).filter(
    userId => ratings2.hasOwnProperty(userId)
  );
  
  if (commonUsers.length < 2) return 0;
  
  const vector1 = commonUsers.map(userId => ratings1[userId]);
  const vector2 = commonUsers.map(userId => ratings2[userId]);
  
  return cosineSimilarity(vector1, vector2);
}

module.exports = {
  itemBasedRecommend
};

