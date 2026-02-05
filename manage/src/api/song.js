import request from './request'

/**
 * 获取音乐列表
 */
export function getSongList(params) {
  return request({
    url: '/admin/songs',
    method: 'get',
    params
  })
}

/**
 * 获取音乐详情
 */
export function getSongDetail(id) {
  return request({
    url: `/admin/songs/${id}`,
    method: 'get'
  })
}

/**
 * 创建音乐
 */
export function createSong(data) {
  return request({
    url: '/admin/songs',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 更新音乐
 */
export function updateSong(id, data) {
  return request({
    url: `/admin/songs/${id}`,
    method: 'put',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 删除音乐
 */
export function deleteSong(id) {
  return request({
    url: `/admin/songs/${id}`,
    method: 'delete'
  })
}

/**
 * 上架/下架音乐
 */
export function updateSongStatus(id, status) {
  return request({
    url: `/api/admin/songs/${id}/status`,
    method: 'put',
    data: { status }
  })
}

/**
 * 批量操作音乐
 */
export function batchOperateSongs(data) {
  return request({
    url: '/admin/songs/batch',
    method: 'post',
    data
  })
}

