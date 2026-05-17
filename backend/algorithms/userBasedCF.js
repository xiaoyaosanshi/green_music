const { pearsonCorrelation } = require('./similarity');
const db = require('../config/database');

/**
 * 基于用户的协同过滤推荐
 */
async function userBasedRecommend(userId, k = 20, limit = 20) {
  // 1. 获取所有用户的评分数据
  const [allRatings] = await db.query(
    `SELECT user_id, song_id, rating FROM user_ratings`
  );
  
  // 2. 构建用户-音乐评分矩阵
  const userRatingMatrix = {};
  allRatings.forEach(row => {
    if (!userRatingMatrix[row.user_id]) {
      userRatingMatrix[row.user_id] = {};
    }
    userRatingMatrix[row.user_id][row.song_id] = parseFloat(row.rating);
  });
  
  // 3. 获取目标用户的评分
  const targetUserRatings = userRatingMatrix[userId] || {};
  if (Object.keys(targetUserRatings).length === 0) {
    return []; // 新用户，无评分数据
  }
  
  // 4. 计算目标用户与其他用户的相似度
  const similarities = [];
  for (const [otherUserId, otherRatings] of Object.entries(userRatingMatrix)) {
    if (Number(otherUserId) === userId) continue;
    
    const similarity = pearsonCorrelation(targetUserRatings, otherRatings);
    if (similarity > 0) {
      similarities.push({
        userId: Number(otherUserId),
        similarity: similarity,
        ratings: otherRatings
      });
    }
  }
  
  // 5. 选择Top-K相似用户
  similarities.sort((a, b) => b.similarity - a.similarity);
  const topKUsers = similarities.slice(0, k);
  
  // 6. 计算目标用户对未评分音乐的预测评分
  const targetUserAvgRating = Object.values(targetUserRatings)
    .reduce((sum, r) => sum + r, 0) / Object.keys(targetUserRatings).length;
  
  const predictions = {};
  const targetUserSongs = new Set(Object.keys(targetUserRatings).map(Number));
  
  topKUsers.forEach(({ similarity, ratings }) => {
    const otherUserAvgRating = Object.values(ratings)
      .reduce((sum, r) => sum + r, 0) / Object.keys(ratings).length;
    
    Object.keys(ratings).forEach(songId => {
      const songIdNum = Number(songId);
      if (!targetUserSongs.has(songIdNum)) {
        if (!predictions[songIdNum]) {
          predictions[songIdNum] = {
            numerator: 0,
            denominator: 0
          };
        }
        const rating = ratings[songId];
        predictions[songIdNum].numerator += 
          similarity * (rating - otherUserAvgRating);
        predictions[songIdNum].denominator += Math.abs(similarity);
      }
    });
  });
  
  // 7. 计算最终预测评分并排序
  const recommendations = Object.entries(predictions)
    .map(([songId, pred]) => ({
      songId: Number(songId),
      predictedRating: targetUserAvgRating + 
        (pred.denominator > 0 ? pred.numerator / pred.denominator : 0)
    }))
    .filter(item => item.predictedRating > 0)
    .sort((a, b) => b.predictedRating - a.predictedRating)
    .slice(0, limit);
  
  return recommendations;
}

module.exports = {
  userBasedRecommend
};

