import request from './index'

/**
 * 收藏歌曲
 * @param {number} songId - 歌曲ID
 */
export const favoriteSong = (songId) => {
  return request({
    url: `/api/favorites/songs/${songId}`,
    method: 'post'
  })
}

/**
 * 取消收藏歌曲
 * @param {number} songId - 歌曲ID
 */
export const unfavoriteSong = (songId) => {
  return request({
    url: `/api/favorites/songs/${songId}`,
    method: 'delete'
  })
}

/**
 * 获取收藏列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 */
export const getFavoriteList = (params) => {
  return request({
    url: '/api/favorites/songs',
    method: 'get',
    params
  })
}

