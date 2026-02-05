import request from './request'

/**
 * 获取歌词列表
 */
export function getLyricList(params) {
  return request({
    url: '/admin/lyrics',
    method: 'get',
    params
  })
}

/**
 * 获取歌词详情
 */
export function getLyricDetail(id) {
  return request({
    url: `/admin/lyrics/${id}`,
    method: 'get'
  })
}

/**
 * 上传官方歌词
 */
export function createLyric(data) {
  return request({
    url: '/admin/lyrics',
    method: 'post',
    data
  })
}

/**
 * 审核歌词
 */
export function reviewLyric(id, data) {
  return request({
    url: `/api/admin/lyrics/${id}/review`,
    method: 'put',
    data
  })
}

/**
 * 删除歌词
 */
export function deleteLyric(id) {
  return request({
    url: `/admin/lyrics/${id}`,
    method: 'delete'
  })
}

