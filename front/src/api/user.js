import request from './index'

/**
 * 获取当前用户信息
 */
export const getCurrentUser = () => {
  return request({
    url: '/api/me',
    method: 'get'
  })
}

/**
 * 更新用户信息
 * @param {Object} data - 用户信息
 */
export const updateUserInfo = (data) => {
  return request({
    url: '/api/me',
    method: 'put',
    data
  })
}

/**
 * 获取播放历史
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 */
export const getPlayHistory = (params) => {
  return request({
    url: '/api/me/play-history',
    method: 'get',
    params
  })
}

/**
 * 清空播放历史
 */
export const clearPlayHistory = () => {
  return request({
    url: '/api/me/play-history',
    method: 'delete'
  })
}

