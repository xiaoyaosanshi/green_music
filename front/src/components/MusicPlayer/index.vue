<template>
  <div v-if="showPlayer" class="music-player">
    <div class="player-content">
      <div class="player-left">
        <div class="song-info" v-if="currentSong">
          <img :src="getCoverUrl(currentSong.cover_url)" class="cover" alt="cover" @error="handleImageError" />
          <div class="info">
            <div class="title">{{ currentSong.title }}</div>
            <div class="artist">{{ currentSong.artist_name }}</div>
          </div>
        </div>
      </div>
      <div class="player-center">
        <div class="controls">
          <el-button
            :icon="PlayModeIcon"
            circle
            size="small"
            @click="togglePlayMode"
            :title="playModeText"
          />
          <el-button :icon="ArrowLeft" circle size="small" @click="handlePrev" :disabled="!hasPrev" />
          <el-button
            :icon="isPlaying ? VideoPause : VideoPlay"
            circle
            size="large"
            type="primary"
            @click="togglePlay"
          />
          <el-button :icon="ArrowRight" circle size="small" @click="handleNext" :disabled="!hasNext" />
          <el-button :icon="List" circle size="small" @click="showPlaylist = !showPlaylist" />
        </div>
        <div class="progress-bar">
          <span class="time">{{ formatTime(currentTime) }}</span>
          <el-slider
            v-model="progress"
            :max="duration"
            :show-tooltip="false"
            @change="handleProgressChange"
            class="slider"
          />
          <span class="time">{{ formatTime(duration) }}</span>
        </div>
      </div>
      <div class="player-right">
        <div class="volume-control">
          <el-button circle size="small" @click="toggleMute" :title="volume > 0 ? '静音' : '取消静音'">
            <el-icon v-if="volume > 0"><VideoPlay /></el-icon>
            <el-icon v-else><VideoPause /></el-icon>
          </el-button>
          <el-slider
            v-model="volume"
            :max="100"
            :show-tooltip="false"
            @change="handleVolumeChange"
            class="volume-slider"
          />
        </div>
      </div>
    </div>
    <audio
      ref="audioRef"
      :src="audioUrl"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @ended="handleEnded"
    />
    <PlaylistPanel v-model="showPlaylist" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/store/player'
import { formatTime } from '@/utils/format'
import { PLAY_MODES, PLAY_MODE_TEXT } from '@/utils/constants'
import { getCoverUrl, handleImageError } from '@/utils/image'
import {
  VideoPlay,
  VideoPause,
  ArrowLeft,
  ArrowRight,
  List,
  RefreshRight,
  Refresh
} from '@element-plus/icons-vue'
import PlaylistPanel from './PlaylistPanel.vue'

const playerStore = usePlayerStore()
const audioRef = ref(null)
const showPlaylist = ref(false)

const currentSong = computed(() => playerStore.currentSong)
const isPlaying = computed(() => playerStore.isPlaying)
const currentTime = computed(() => playerStore.currentTime)
const duration = computed(() => playerStore.duration)
const volume = computed({
  get: () => playerStore.volume * 100,
  set: (val) => playerStore.setVolume(val / 100)
})
const showPlayer = computed(() => playerStore.showPlayer)
const hasNext = computed(() => playerStore.hasNext)
const hasPrev = computed(() => playerStore.hasPrev)
const playMode = computed(() => playerStore.playMode)
const progress = computed({
  get: () => playerStore.currentTime,
  set: (val) => playerStore.setCurrentTime(val)
})

const playModeText = computed(() => PLAY_MODE_TEXT[playMode.value])
const PlayModeIcon = computed(() => {
  if (playMode.value === PLAY_MODES.LOOP) return Refresh
  if (playMode.value === PLAY_MODES.RANDOM) return RefreshRight
  return List
})

const audioUrl = computed(() => {
  if (!currentSong.value?.file_url) return ''
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
  return `${baseUrl}${currentSong.value.file_url}`
})


// 播放/暂停
const togglePlay = () => {
  if (isPlaying.value) {
    playerStore.pause()
    audioRef.value?.pause()
  } else {
    playerStore.resume()
    audioRef.value?.play()
  }
}

// 上一首
const handlePrev = () => {
  playerStore.prev()
}

// 下一首
const handleNext = () => {
  playerStore.next()
}

// 切换播放模式
const togglePlayMode = () => {
  const modes = Object.values(PLAY_MODES)
  const currentIndex = modes.indexOf(playMode.value)
  const nextIndex = (currentIndex + 1) % modes.length
  playerStore.setPlayMode(modes[nextIndex])
}

// 进度条变化
const handleProgressChange = (val) => {
  if (audioRef.value) {
    audioRef.value.currentTime = val
    playerStore.setCurrentTime(val)
  }
}

// 音量变化
const handleVolumeChange = (val) => {
  if (audioRef.value) {
    audioRef.value.volume = val / 100
  }
}

// 静音切换
const toggleMute = () => {
  if (volume.value > 0) {
    playerStore.setVolume(0)
    if (audioRef.value) audioRef.value.volume = 0
  } else {
    playerStore.setVolume(0.7)
    if (audioRef.value) audioRef.value.volume = 0.7
  }
}

// 时间更新
const handleTimeUpdate = () => {
  if (audioRef.value) {
    playerStore.setCurrentTime(audioRef.value.currentTime)
  }
}

// 加载元数据
const handleLoadedMetadata = () => {
  if (audioRef.value) {
    playerStore.setDuration(audioRef.value.duration)
  }
}

// 播放结束
const handleEnded = () => {
  if (playMode.value === PLAY_MODES.LOOP) {
    // 单曲循环
    audioRef.value?.play()
  } else {
    // 下一首
    handleNext()
  }
}

// 监听播放状态
watch(isPlaying, (val) => {
  if (val) {
    audioRef.value?.play()
  } else {
    audioRef.value?.pause()
  }
})

// 监听歌曲变化
watch(currentSong, (newSong) => {
  if (newSong && audioRef.value) {
    audioRef.value.load()
    if (isPlaying.value) {
      audioRef.value.play()
    }
  }
})

// 初始化音量
onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = playerStore.volume
  }
})

onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
})
</script>

<style lang="scss" scoped>
.music-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(155, 225, 93, 0.3);
  z-index: 1000;
  @include gradient-bg;
  box-shadow: 0 -2px 8px rgba(155, 225, 93, 0.15);
}

.player-content {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  padding: 0 $spacing-lg;
  @include flex-between;
  gap: $spacing-lg;
}

.player-left {
  flex: 0 0 300px;
}

.song-info {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  height: 100%;
}

.cover {
  width: 56px;
  height: 56px;
  border-radius: $radius-sm;
  object-fit: cover;
}

.info {
  flex: 1;
  min-width: 0;
}

.title {
  font-size: $font-size-sm;
  font-weight: 500;
  color: $text-white;
  @include text-ellipsis;
  margin-bottom: $spacing-xs;
}

.artist {
  font-size: $font-size-xs;
  color: rgba(255, 255, 255, 0.8);
  @include text-ellipsis;
}

.player-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  padding: 0 $spacing-lg;
}

.controls {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.progress-bar {
  width: 100%;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.time {
  font-size: $font-size-xs;
  color: $text-white;
  min-width: 40px;
  text-align: center;
}

.slider {
  flex: 1;
}

:deep(.el-slider__runway) {
  background-color: rgba(255, 255, 255, 0.3);
}

:deep(.el-slider__bar) {
  background-color: $text-white;
}

:deep(.el-slider__button) {
  border-color: $text-white;
  background-color: $text-white;
}

.player-right {
  flex: 0 0 200px;
  display: flex;
  justify-content: flex-end;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.volume-slider {
  width: 100px;
}

audio {
  display: none;
}
</style>

