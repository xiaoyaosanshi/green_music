import request from './index'

/**
 * 获取歌曲列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.keyword - 搜索关键词
 * @param {number} params.genreId - 类型ID
 * @param {number} params.artistId - 歌手ID
 */
export const getSongList = (params) => {
  return request({
    url: '/api/songs',
    method: 'get',
    params
  })
}

/**
 * 获取歌曲详情
 * @param {number} id - 歌曲ID
 */
export const getSongDetail = (id) => {
  return request({
    url: `/api/songs/${id}`,
    method: 'get'
  })
}

/**
 * 获取歌词
 * @param {number} id - 歌曲ID
 * @param {string} language - 语言，默认 "zh"
 */
export const getLyrics = (id, language = 'zh') => {
  return request({
    url: `/api/songs/${id}/lyrics`,
    method: 'get',
    params: { language }
  })
}

