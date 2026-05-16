import request from './request'

/**
 * 获取操作日志列表
 */
export function getLogList(params) {
  return request({
    url: '/admin/logs',
    method: 'get',
    params
  })
}

/**
 * 获取日志详情
 */
export function getLogDetail(id) {
  return request({
    url: `/admin/logs/${id}`,
    method: 'get'
  })
}

