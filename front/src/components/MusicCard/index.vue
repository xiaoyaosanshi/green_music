<template>
  <div class="music-card" @click="handleClick">
    <div class="card-cover">
      <img :src="getCoverUrl(song.cover_url)" :alt="song.title" @error="handleImageError" />
      <div class="cover-overlay">
        <el-button
          :icon="isCurrentSong && isPlaying ? VideoPause : VideoPlay"
          circle
          type="primary"
          size="large"
          @click.stop="handlePlay"
        />
      </div>
    </div>
    <div class="card-info">
      <div class="card-title" :title="song.title">{{ song.title }}</div>
      <div class="card-artist" :title="song.artist_name">{{ song.artist_name }}</div>
    </div>
    <div class="card-actions" v-if="showActions" @click.stop>
      <el-button
        :icon="isFavorite ? StarFilled : Star"
        circle
        size="small"
        @click="handleFavorite"
        :type="isFavorite ? 'primary' : 'default'"
      />
      <el-dropdown @command="handleCommand">
        <el-button :icon="More" circle size="small" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="addToPlaylist">添加到歌单</el-dropdown-item>
            <el-dropdown-item command="share">分享</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '@/store/player'
import { VideoPlay, VideoPause, Star, StarFilled, More } from '@element-plus/icons-vue'
import { getCoverUrl, handleImageError } from '@/utils/image'

const props = defineProps({
  song: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['play', 'favorite', 'addToPlaylist'])

const playerStore = usePlayerStore()

const isCurrentSong = computed(() => playerStore.currentSong?.id === props.song.id)
const isPlaying = computed(() => playerStore.isPlaying && isCurrentSong.value)
const isFavorite = computed(() => {
  // TODO: 从收藏列表检查
  return false
})


const handleClick = () => {
  // 可以跳转到歌曲详情页
}

const handlePlay = () => {
  if (isCurrentSong.value) {
    if (isPlaying.value) {
      playerStore.pause()
    } else {
      playerStore.resume()
    }
  } else {
    playerStore.play(props.song)
  }
  emit('play', props.song)
}

const handleFavorite = () => {
  emit('favorite', props.song)
}

const handleCommand = (command) => {
  if (command === 'addToPlaylist') {
    emit('addToPlaylist', props.song)
  } else if (command === 'share') {
    // TODO: 分享功能
  }
}
</script>

<style lang="scss" scoped>
.music-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: all $transition-fast;
  background: rgba(255, 255, 255, 0.5);

  &:hover {
    background: rgba(155, 225, 93, 0.15);
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(155, 225, 93, 0.2);

    .cover-overlay {
      opacity: 1;
    }
  }
}

.card-cover {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: $radius-sm;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(155, 225, 93, 0.1) 0%, rgba(0, 227, 174, 0.1) 100%);
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    @include flex-center;
    background: rgba(155, 225, 93, 0.3);
    opacity: 0;
    transition: opacity $transition-base;
  }
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: $font-size-sm;
  color: $text-primary;
  @include text-ellipsis;
  margin-bottom: $spacing-xs;
}

.card-artist {
  font-size: $font-size-xs;
  color: $text-secondary;
  @include text-ellipsis;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  flex-shrink: 0;
}
</style>

