const { userBasedRecommend } = require('./userBasedCF');
const { itemBasedRecommend } = require('./itemBasedCF');

/**
 * 混合推荐算法
 */
async function hybridRecommend(userId, limit = 20, userWeight = 0.6, itemWeight = 0.4) {
  // 并行执行两种推荐算法
  const [userBasedResults, itemBasedResults] = await Promise.all([
    userBasedRecommend(userId, 20, limit * 2),
    itemBasedRecommend(userId, limit * 2)
  ]);
  
  // 构建推荐分数映射
  const scoreMap = {};
  
  // 合并基于用户的推荐分数
  userBasedResults.forEach(item => {
    if (!scoreMap[item.songId]) {
      scoreMap[item.songId] = 0;
    }
    scoreMap[item.songId] += item.predictedRating * userWeight;
  });
  
  // 合并基于物品的推荐分数
  itemBasedResults.forEach(item => {
    if (!scoreMap[item.songId]) {
      scoreMap[item.songId] = 0;
    }
    scoreMap[item.songId] += item.predictedRating * itemWeight;
  });
  
  // 归一化并排序
  const recommendations = Object.entries(scoreMap)
    .map(([songId, score]) => ({
      songId: Number(songId),
      predictedRating: score
    }))
    .sort((a, b) => b.predictedRating - a.predictedRating)
    .slice(0, limit);
  
  return recommendations;
}

module.exports = {
  hybridRecommend
};

