import request from './request'

/**
 * 获取数据统计概览
 */
export function getStatistics() {
  return request({
    url: '/admin/statistics',
    method: 'get'
  })
}

/**
 * 获取用户统计
 */
export function getUserStatistics(params) {
  return request({
    url: '/api/admin/statistics/users',
    method: 'get',
    params
  })
}

/**
 * 获取音乐统计
 */
export function getSongStatistics(params) {
  return request({
    url: '/api/admin/statistics/songs',
    method: 'get',
    params
  })
}

/**
 * 获取播放统计
 */
export function getPlaybackStatistics(params) {
  return request({
    url: '/api/admin/statistics/playback',
    method: 'get',
    params
  })
}

/**
 * 获取推荐统计
 */
export function getRecommendStatistics(params) {
  return request({
    url: '/api/admin/statistics/recommend',
    method: 'get',
    params
  })
}

