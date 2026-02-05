import request from './index'

/**
 * 获取评论列表
 * @param {Object} params - 查询参数
 * @param {number} params.songId - 歌曲ID
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.sort - 排序方式，"time" 或 "hot"
 */
export const getCommentList = (params) => {
  return request({
    url: '/api/comments',
    method: 'get',
    params
  })
}

/**
 * 发表评论
 * @param {Object} data - 评论数据
 * @param {number} data.songId - 歌曲ID
 * @param {string} data.content - 评论内容
 * @param {number} data.parentId - 父评论ID，0表示顶级评论
 */
export const createComment = (data) => {
  return request({
    url: '/api/comments',
    method: 'post',
    data
  })
}

/**
 * 点赞评论
 * @param {number} id - 评论ID
 */
export const likeComment = (id) => {
  return request({
    url: `/api/comments/${id}/like`,
    method: 'post'
  })
}

/**
 * 取消点赞
 * @param {number} id - 评论ID
 */
export const unlikeComment = (id) => {
  return request({
    url: `/api/comments/${id}/like`,
    method: 'delete'
  })
}

