import { defineStore } from 'pinia'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/utils/constants'
import { login as loginApi } from '@/api/auth'
import { getCurrentUser as getUserInfo } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: getStorage(STORAGE_KEYS.USER_INFO, null),
    token: getStorage(STORAGE_KEYS.TOKEN, ''),
    isLogin: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && state.isLogin
  },

  actions: {
    // 登录
    async login(identity, password) {
      try {
        const res = await loginApi({ identity, password })
        if (res.code === 0 && res.data) {
          this.token = res.data.token
          this.userInfo = res.data.userInfo
          this.isLogin = true
          setStorage(STORAGE_KEYS.TOKEN, this.token)
          setStorage(STORAGE_KEYS.USER_INFO, this.userInfo)
          return res.data
        }
        throw new Error(res.message || '登录失败')
      } catch (error) {
        throw error
      }
    },

    // 登出
    logout() {
      this.token = ''
      this.userInfo = null
      this.isLogin = false
      removeStorage(STORAGE_KEYS.TOKEN)
      removeStorage(STORAGE_KEYS.USER_INFO)
    },

    // 更新用户信息
    updateUserInfo(userInfo) {
      this.userInfo = { ...this.userInfo, ...userInfo }
      setStorage(STORAGE_KEYS.USER_INFO, this.userInfo)
    },

    // 检查登录状态
    async checkAuth() {
      if (!this.token) {
        this.isLogin = false
        return false
      }

      try {
        const res = await getUserInfo()
        if (res.code === 0 && res.data) {
          this.userInfo = res.data
          this.isLogin = true
          setStorage(STORAGE_KEYS.USER_INFO, this.userInfo)
          return true
        }
        this.logout()
        return false
      } catch (error) {
        this.logout()
        return false
      }
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['token', 'userInfo']
      }
    ]
  }
})

