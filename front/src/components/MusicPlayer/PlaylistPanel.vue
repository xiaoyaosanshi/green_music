<template>
  <el-drawer v-model="visible" title="播放列表" size="400px" direction="rtl">
    <div class="playlist-panel">
      <div class="playlist-header">
        <span>共 {{ playlist.length }} 首</span>
        <el-button type="text" @click="clearPlaylist">清空</el-button>
      </div>
      <div class="playlist-content">
        <div
          v-for="(song, index) in playlist"
          :key="song.id"
          class="playlist-item"
          :class="{ active: index === currentIndex }"
          @click="playSong(song, index)"
        >
          <div class="item-index">{{ index + 1 }}</div>
          <div class="item-info">
            <div class="item-title">{{ song.title }}</div>
            <div class="item-artist">{{ song.artist_name }}</div>
          </div>
          <div class="item-duration">{{ formatTime(song.duration) }}</div>
          <el-button
            type="text"
            :icon="Delete"
            circle
            size="small"
            @click.stop="removeSong(index)"
          />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '@/store/player'
import { formatTime } from '@/utils/format'
import { Delete } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const playerStore = usePlayerStore()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const playlist = computed(() => playerStore.playlist)
const currentIndex = computed(() => playerStore.currentIndex)

const playSong = (song, index) => {
  playerStore.currentIndex = index
  playerStore.currentSong = song
  playerStore.isPlaying = true
  playerStore.isPaused = false
}

const removeSong = (index) => {
  playerStore.removeFromPlaylist(index)
}

const clearPlaylist = () => {
  playerStore.clearPlaylist()
}
</script>

<style lang="scss" scoped>
.playlist-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(240, 249, 245, 0.95);
}

.playlist-header {
  @include flex-between;
  padding: $spacing-md 0;
  border-bottom: 1px solid rgba(155, 225, 93, 0.2);
  font-size: $font-size-sm;
  color: $text-secondary;
}

.playlist-content {
  flex: 1;
  overflow-y: auto;
  margin-top: $spacing-md;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(155, 225, 93, 0.15);
    transform: translateX(4px);
  }

  &.active {
    background: rgba(155, 225, 93, 0.2);
    color: $primary-start;
    border-left: 3px solid $primary-start;
    padding-left: calc($spacing-md - 3px);
  }
}

.item-index {
  width: 24px;
  text-align: center;
  font-size: $font-size-xs;
  color: $text-secondary;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: $font-size-sm;
  @include text-ellipsis;
  margin-bottom: $spacing-xs;
}

.item-artist {
  font-size: $font-size-xs;
  color: $text-secondary;
  @include text-ellipsis;
}

.item-duration {
  font-size: $font-size-xs;
  color: $text-secondary;
  min-width: 50px;
  text-align: right;
}
</style>

