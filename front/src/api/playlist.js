import request from './index'

/**
 * 获取歌单列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {number} params.userId - 用户ID
 * @param {string} params.keyword - 搜索关键词
 */
export const getPlaylistList = (params) => {
  return request({
    url: '/api/playlists',
    method: 'get',
    params
  })
}

/**
 * 获取歌单详情
 * @param {number} id - 歌单ID
 */
export const getPlaylistDetail = (id) => {
  return request({
    url: `/api/playlists/${id}`,
    method: 'get'
  })
}

/**
 * 创建歌单
 * @param {Object} data - 歌单数据
 * @param {string} data.name - 歌单名称
 * @param {string} data.description - 歌单描述
 * @param {boolean} data.isPublic - 是否公开
 */
export const createPlaylist = (data) => {
  return request({
    url: '/api/playlists',
    method: 'post',
    data
  })
}

/**
 * 更新歌单
 * @param {number} id - 歌单ID
 * @param {Object} data - 歌单数据
 */
export const updatePlaylist = (id, data) => {
  return request({
    url: `/api/playlists/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除歌单
 * @param {number} id - 歌单ID
 */
export const deletePlaylist = (id) => {
  return request({
    url: `/api/playlists/${id}`,
    method: 'delete'
  })
}

