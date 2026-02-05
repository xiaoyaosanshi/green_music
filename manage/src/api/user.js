import request from './request'

/**
 * 获取用户列表
 */
export function getUserList(params) {
  return request({
    url: '/admin/users',
    method: 'get',
    params
  })
}

/**
 * 获取用户详情
 */
export function getUserDetail(id) {
  return request({
    url: `/admin/users/${id}`,
    method: 'get'
  })
}

/**
 * 更新用户状态
 */
export function updateUserStatus(id, status) {
  return request({
    url: `/api/admin/users/${id}/status`,
    method: 'put',
    data: { status }
  })
}

/**
 * 重置用户密码
 */
export function resetUserPassword(id) {
  return request({
    url: `/api/admin/users/${id}/reset-password`,
    method: 'post'
  })
}

/**
 * 删除用户
 */
export function deleteUser(id) {
  return request({
    url: `/admin/users/${id}`,
    method: 'delete'
  })
}

