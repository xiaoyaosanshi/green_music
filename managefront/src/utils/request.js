import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getAdminToken, removeAdminToken, removeAdminInfo } from './auth'
import { ERROR_CODES, RESPONSE_CODE } from './constants'

// 开发环境使用代理，生产环境使用环境变量配置的地址
const baseURL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001')
  : '/api' // 开发环境使用 Vite 代理

const service = axios.create({
  baseURL,
  timeout: 30000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = getAdminToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data

    // 成功响应
    if (res.code === RESPONSE_CODE.SUCCESS) {
      return res
    }

    // 处理错误码
    const errorMessage = res.message || '请求失败'
    
    // 特殊错误处理
    if (res.code === ERROR_CODES.AUTH_TOKEN_INVALID || res.code === ERROR_CODES.AUTH_TOKEN_MISSING) {
      removeAdminToken()
      removeAdminInfo()
      ElMessage.error('登录已过期，请重新登录')
      // 跳转到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      return Promise.reject(new Error(errorMessage))
    }

    ElMessage.error(errorMessage)
    return Promise.reject(new Error(errorMessage))
  },
  (error) => {
    let message = '网络错误'
    if (error.response) {
      const { status, data } = error.response
      message = data?.message || `请求失败 (${status})`
      
      // 401 未授权
      if (status === 401) {
        removeAdminToken()
        removeAdminInfo()
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    } else if (error.request) {
      message = '网络连接失败，请检查网络'
    } else {
      message = error.message || '请求失败'
    }
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default service

