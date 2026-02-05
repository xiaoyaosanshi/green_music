import request from './request'

/**
 * 获取专辑列表
 */
export function getAlbumList(params) {
  return request({
    url: '/admin/albums',
    method: 'get',
    params
  })
}

/**
 * 获取专辑详情
 */
export function getAlbumDetail(id) {
  return request({
    url: `/admin/albums/${id}`,
    method: 'get'
  })
}

/**
 * 创建专辑
 */
export function createAlbum(data) {
  return request({
    url: '/admin/albums',
    method: 'post',
    data
  })
}

/**
 * 更新专辑
 */
export function updateAlbum(id, data) {
  return request({
    url: `/admin/albums/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除专辑
 */
export function deleteAlbum(id) {
  return request({
    url: `/admin/albums/${id}`,
    method: 'delete'
  })
}

