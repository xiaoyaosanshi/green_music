import request from './index'

/**
 * 用户登录
 * @param {Object} data - 登录数据
 * @param {string} data.identity - 用户名或邮箱
 * @param {string} data.password - 密码
 */
export const login = (data) => {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

/**
 * 用户注册
 * @param {Object} data - 注册数据
 * @param {string} data.username - 用户名
 * @param {string} data.email - 邮箱
 * @param {string} data.password - 密码
 * @param {string} data.nickname - 昵称
 */
export const register = (data) => {
  return request({
    url: '/api/auth/register',
    method: 'post',
    data
  })
}

