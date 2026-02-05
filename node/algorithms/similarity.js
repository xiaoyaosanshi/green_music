/**
 * 相似度计算工具
 */

/**
 * 计算余弦相似度
 */
function cosineSimilarity(vector1, vector2) {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    norm1 += vector1[i] * vector1[i];
    norm2 += vector2[i] * vector2[i];
  }
  
  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * 计算皮尔逊相关系数
 */
function pearsonCorrelation(ratings1, ratings2) {
  const commonItems = Object.keys(ratings1).filter(
    songId => ratings2.hasOwnProperty(songId)
  );
  
  if (commonItems.length === 0) return 0;
  
  const n = commonItems.length;
  let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
  
  commonItems.forEach(songId => {
    const r1 = ratings1[songId];
    const r2 = ratings2[songId];
    sum1 += r1;
    sum2 += r2;
    sum1Sq += r1 * r1;
    sum2Sq += r2 * r2;
    pSum += r1 * r2;
  });
  
  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  if (den === 0) return 0;
  return num / den;
}

module.exports = {
  cosineSimilarity,
  pearsonCorrelation
};

