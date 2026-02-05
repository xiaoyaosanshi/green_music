import request from './request'

/**
 * 获取歌单列表
 */
export function getPlaylistList(params) {
  return request({
    url: '/admin/playlists',
    method: 'get',
    params
  })
}

/**
 * 获取歌单详情
 */
export function getPlaylistDetail(id) {
  return request({
    url: `/admin/playlists/${id}`,
    method: 'get'
  })
}

/**
 * 更新歌单
 */
export function updatePlaylist(id, data) {
  return request({
    url: `/admin/playlists/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除歌单
 */
export function deletePlaylist(id) {
  return request({
    url: `/admin/playlists/${id}`,
    method: 'delete'
  })
}

