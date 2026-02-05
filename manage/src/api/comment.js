import request from './request'

/**
 * 获取评论列表
 */
export function getCommentList(params) {
  return request({
    url: '/admin/comments',
    method: 'get',
    params
  })
}

/**
 * 获取评论详情
 */
export function getCommentDetail(id) {
  return request({
    url: `/admin/comments/${id}`,
    method: 'get'
  })
}

/**
 * 审核评论
 */
export function reviewComment(id, data) {
  return request({
    url: `/api/admin/comments/${id}/review`,
    method: 'put',
    data
  })
}

/**
 * 删除评论
 */
export function deleteComment(id) {
  return request({
    url: `/admin/comments/${id}`,
    method: 'delete'
  })
}

