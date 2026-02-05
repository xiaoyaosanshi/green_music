import { defineStore } from 'pinia'
import { getPlaylistList, getPlaylistDetail } from '@/api/playlist'
import { useUserStore } from './user'

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    myPlaylists: [], // 我的歌单
    favoritePlaylists: [], // 收藏的歌单
    currentPlaylist: null // 当前查看的歌单
  }),

  actions: {
    // 获取我的歌单
    async fetchMyPlaylists(params = {}) {
      try {
        const userStore = useUserStore()
        const res = await getPlaylistList({
          ...params,
          userId: userStore.userInfo?.id
        })
        if (res.code === 0 && res.data) {
          this.myPlaylists = res.data.list || []
          return res.data
        }
      } catch (error) {
        console.error('获取我的歌单失败:', error)
        throw error
      }
    },

    // 获取收藏的歌单
    async fetchFavoritePlaylists(params = {}) {
      try {
        // 这里需要根据实际API调整
        const res = await getPlaylistList({
          ...params,
          favorite: true
        })
        if (res.code === 0 && res.data) {
          this.favoritePlaylists = res.data.list || []
          return res.data
        }
      } catch (error) {
        console.error('获取收藏歌单失败:', error)
        throw error
      }
    },

    // 获取歌单详情
    async fetchPlaylistDetail(id) {
      try {
        const res = await getPlaylistDetail(id)
        if (res.code === 0 && res.data) {
          this.currentPlaylist = res.data
          return res.data
        }
      } catch (error) {
        console.error('获取歌单详情失败:', error)
        throw error
      }
    },

    // 创建歌单
    createPlaylist(data) {
      // 这里需要调用API，暂时先更新本地状态
      const newPlaylist = {
        id: Date.now(),
        ...data,
        song_count: 0,
        created_at: new Date().toISOString()
      }
      this.myPlaylists.unshift(newPlaylist)
      return newPlaylist
    },

    // 更新歌单
    updatePlaylist(id, data) {
      const index = this.myPlaylists.findIndex((p) => p.id === id)
      if (index !== -1) {
        this.myPlaylists[index] = { ...this.myPlaylists[index], ...data }
      }
      if (this.currentPlaylist && this.currentPlaylist.id === id) {
        this.currentPlaylist = { ...this.currentPlaylist, ...data }
      }
    },

    // 删除歌单
    deletePlaylist(id) {
      this.myPlaylists = this.myPlaylists.filter((p) => p.id !== id)
      if (this.currentPlaylist && this.currentPlaylist.id === id) {
        this.currentPlaylist = null
      }
    }
  }
})
