import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { ERROR_CODES, RESPONSE_CODE } from '@/utils/constants'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
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
      const userStore = useUserStore()
      userStore.logout()
      ElMessage.error('登录已过期，请重新登录')
      // 可以在这里跳转到登录页
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

