import { defineStore } from 'pinia'
import { PLAY_MODES } from '@/utils/constants'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentSong: null, // 当前播放歌曲
    playlist: [], // 播放列表
    currentIndex: 0, // 当前播放索引
    isPlaying: false, // 是否播放中
    isPaused: false, // 是否暂停
    volume: 0.7, // 音量 (0-1)
    currentTime: 0, // 当前播放时间
    duration: 0, // 总时长
    playMode: PLAY_MODES.SEQUENCE, // 播放模式
    showPlayer: false // 是否显示播放器
  }),

  getters: {
    hasNext: (state) => {
      if (state.playlist.length === 0) return false
      if (state.playMode === PLAY_MODES.LOOP) return true
      return state.currentIndex < state.playlist.length - 1
    },

    hasPrev: (state) => {
      if (state.playlist.length === 0) return false
      if (state.playMode === PLAY_MODES.LOOP) return true
      return state.currentIndex > 0
    }
  },

  actions: {
    // 播放歌曲
    play(song) {
      if (!song) return

      // 如果歌曲已在播放列表中，直接切换
      const index = this.playlist.findIndex((s) => s.id === song.id)
      if (index !== -1) {
        this.currentIndex = index
        this.currentSong = this.playlist[index]
      } else {
        // 添加到播放列表
        this.playlist.push(song)
        this.currentIndex = this.playlist.length - 1
        this.currentSong = song
      }

      this.isPlaying = true
      this.isPaused = false
      this.showPlayer = true
    },

    // 暂停
    pause() {
      this.isPlaying = false
      this.isPaused = true
    },

    // 继续播放
    resume() {
      this.isPlaying = true
      this.isPaused = false
    },

    // 下一首
    next() {
      if (!this.hasNext) return

      if (this.playMode === PLAY_MODES.RANDOM) {
        this.currentIndex = Math.floor(Math.random() * this.playlist.length)
      } else if (this.playMode === PLAY_MODES.LOOP) {
        // 单曲循环，不改变索引
      } else {
        this.currentIndex++
      }

      this.currentSong = this.playlist[this.currentIndex]
      this.isPlaying = true
      this.isPaused = false
    },

    // 上一首
    prev() {
      if (!this.hasPrev) return

      if (this.playMode === PLAY_MODES.RANDOM) {
        this.currentIndex = Math.floor(Math.random() * this.playlist.length)
      } else if (this.playMode === PLAY_MODES.LOOP) {
        // 单曲循环，不改变索引
      } else {
        this.currentIndex--
      }

      this.currentSong = this.playlist[this.currentIndex]
      this.isPlaying = true
      this.isPaused = false
    },

    // 设置音量
    setVolume(volume) {
      this.volume = Math.max(0, Math.min(1, volume))
    },

    // 设置当前时间
    setCurrentTime(time) {
      this.currentTime = time
    },

    // 设置总时长
    setDuration(duration) {
      this.duration = duration
    },

    // 设置播放模式
    setPlayMode(mode) {
      this.playMode = mode
    },

    // 添加到播放列表
    addToPlaylist(song) {
      if (!this.playlist.find((s) => s.id === song.id)) {
        this.playlist.push(song)
      }
    },

    // 从播放列表移除
    removeFromPlaylist(index) {
      if (index >= 0 && index < this.playlist.length) {
        this.playlist.splice(index, 1)
        if (this.currentIndex >= this.playlist.length) {
          this.currentIndex = Math.max(0, this.playlist.length - 1)
        }
        if (this.playlist.length === 0) {
          this.currentSong = null
          this.isPlaying = false
        } else {
          this.currentSong = this.playlist[this.currentIndex]
        }
      }
    },

    // 清空播放列表
    clearPlaylist() {
      this.playlist = []
      this.currentSong = null
      this.currentIndex = 0
      this.isPlaying = false
    },

    // 设置播放列表
    setPlaylist(songs) {
      this.playlist = songs
      if (songs.length > 0) {
        this.currentIndex = 0
        this.currentSong = songs[0]
      }
    }
  }
})

