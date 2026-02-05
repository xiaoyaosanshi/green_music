<template>
  <div class="playlist-card" :class="size" @click="handleClick">
    <div class="card-cover">
      <img :src="getCoverUrl(playlist.cover_url)" :alt="playlist.name" @error="handleImageError" />
      <div class="cover-overlay">
        <el-button :icon="VideoPlay" circle type="primary" size="large" @click.stop="handlePlay" />
      </div>
      <div class="play-count" v-if="playlist.play_count">
        <el-icon><View /></el-icon>
        {{ formatNumber(playlist.play_count) }}
      </div>
    </div>
    <div class="card-info">
      <div class="card-name" :title="playlist.name">{{ playlist.name }}</div>
      <div class="card-meta">
        <span v-if="playlist.song_count !== undefined">{{ playlist.song_count }} 首</span>
        <span v-if="playlist.username">by {{ playlist.nickname || playlist.username }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/store/player'
import { formatNumber } from '@/utils/format'
import { VideoPlay, View } from '@element-plus/icons-vue'
import { getCoverUrl, handleImageError } from '@/utils/image'

const props = defineProps({
  playlist: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'medium',
    validator: (val) => ['small', 'medium', 'large'].includes(val)
  }
})

const emit = defineEmits(['click', 'play'])

const router = useRouter()
const playerStore = usePlayerStore()


const handleClick = () => {
  router.push(`/playlist/${props.playlist.id}`)
  emit('click', props.playlist)
}

const handlePlay = () => {
  emit('play', props.playlist)
  // TODO: 获取歌单歌曲并播放
}
</script>

<style lang="scss" scoped>
.playlist-card {
  cursor: pointer;
  transition: transform $transition-base;

  &:hover {
    transform: translateY(-4px);

    .cover-overlay {
      opacity: 1;
    }
  }
}

.card-cover {
  position: relative;
  border-radius: $radius-md;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(155, 225, 93, 0.1) 0%, rgba(0, 227, 174, 0.1) 100%);
  aspect-ratio: 1;

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

  .play-count {
    position: absolute;
    top: $spacing-sm;
    right: $spacing-sm;
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-xs $spacing-sm;
    background: rgba(155, 225, 93, 0.85);
    backdrop-filter: blur(4px);
    border-radius: $radius-sm;
    color: $text-white;
    font-size: $font-size-xs;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(155, 225, 93, 0.3);
  }
}

.card-info {
  margin-top: $spacing-md;
}

.card-name {
  font-size: $font-size-sm;
  font-weight: 500;
  color: $text-primary;
  @include text-ellipsis;
  margin-bottom: $spacing-xs;
  transition: color $transition-fast;
}

.playlist-card:hover .card-name {
  color: $primary-start;
}

.card-meta {
  font-size: $font-size-xs;
  color: $text-secondary;
  @include text-ellipsis;

  span {
    margin-right: $spacing-sm;

    &:last-child {
      margin-right: 0;
    }
  }
}

// 尺寸变体
.playlist-card.small {
  .card-cover {
    border-radius: $radius-sm;
  }
}

.playlist-card.large {
  .card-name {
    font-size: $font-size-md;
  }
}
</style>

