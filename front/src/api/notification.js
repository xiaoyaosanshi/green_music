import request from './index'

/**
 * 获取通知列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {number} params.isRead - 是否已读，0-未读，1-已读
 */
export const getNotificationList = (params) => {
  return request({
    url: '/api/notifications',
    method: 'get',
    params
  })
}

/**
 * 获取未读通知数量
 */
export const getUnreadCount = () => {
  return request({
    url: '/api/notifications/unread-count',
    method: 'get'
  })
}

/**
 * 标记通知为已读
 * @param {number} id - 通知ID
 */
export const markAsRead = (id) => {
  return request({
    url: `/api/notifications/${id}/read`,
    method: 'put'
  })
}

/**
 * 全部标记为已读
 */
export const markAllAsRead = () => {
  return request({
    url: '/api/notifications/read-all',
    method: 'put'
  })
}

