import { defineStore } from 'pinia'
import { adminLogin, getAdminInfo } from '@/api/admin'
import { setAdminToken, removeAdminToken, setAdminInfo, removeAdminInfo } from '@/utils/auth'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    adminInfo: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    username: (state) => state.adminInfo?.username || '',
    role: (state) => state.adminInfo?.role || ''
  },

  actions: {
    /**
     * 登录
     */
    async login(loginForm) {
      try {
        const res = await adminLogin(loginForm)
        if (res.code === 0 && res.data) {
          const { token, admin } = res.data
          this.token = token
          this.adminInfo = admin
          setAdminToken(token)
          setAdminInfo(admin)
          ElMessage.success('登录成功')
          return true
        }
        return false
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
        return false
      }
    },

    /**
     * 获取管理员信息
     */
    async fetchAdminInfo() {
      try {
        const res = await getAdminInfo()
        if (res.code === 0 && res.data) {
          this.adminInfo = res.data
          setAdminInfo(res.data)
          return true
        }
        return false
      } catch (error) {
        return false
      }
    },

    /**
     * 退出登录
     */
    logout() {
      this.token = ''
      this.adminInfo = null
      removeAdminToken()
      removeAdminInfo()
    }
  },

  persist: {
    key: 'admin-user',
    storage: localStorage
  }
})

