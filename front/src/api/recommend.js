import request from './index'

/**
 * 获取个性化推荐
 * @param {Object} params - 查询参数
 * @param {string} params.type - 推荐类型，"song" | "playlist" | "artist" | "album"
 * @param {number} params.limit - 返回数量
 */
export const getPersonalRecommend = (params) => {
  return request({
    url: '/api/recommend/personal',
    method: 'get',
    params
  })
}

/**
 * 获取热门推荐
 * @param {Object} params - 查询参数
 * @param {string} params.type - 推荐类型
 * @param {number} params.limit - 返回数量
 */
export const getHotRecommend = (params) => {
  return request({
    url: '/api/recommend/hot',
    method: 'get',
    params
  })
}

/**
 * 获取相似歌曲
 * @param {number} songId - 歌曲ID
 * @param {number} limit - 返回数量
 */
export const getSimilarSongs = (songId, limit = 10) => {
  return request({
    url: `/api/recommend/similar/${songId}`,
    method: 'get',
    params: { limit }
  })
}

