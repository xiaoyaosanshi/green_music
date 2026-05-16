import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebarCollapsed: false,
    theme: 'light'
  }),

  actions: {
    /**
     * 切换侧边栏
     */
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    /**
     * 设置侧边栏状态
     */
    setSidebarCollapsed(collapsed) {
      this.sidebarCollapsed = collapsed
    },

    /**
     * 切换主题
     */
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    }
  },

  persist: {
    key: 'admin-app',
    storage: localStorage
  }
})

