import request from './request'

/**
 * 管理员登录
 */
export function adminLogin(data) {
  return request({
    url: '/admin/auth/login',
    method: 'post',
    data
  })
}

/**
 * 获取管理员信息
 */
export function getAdminInfo() {
  return request({
    url: '/admin/auth/info',
    method: 'get'
  })
}

/**
 * 退出登录（前端处理，无需调用后端）
 */
export function adminLogout() {
  // 退出登录由前端清除 token 即可，无需调用后端
  return Promise.resolve({ code: 0, message: '退出成功' })
}

