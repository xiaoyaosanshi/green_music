<template>
  <div class="playlist-page" v-if="playlist">
    <div class="playlist-header">
      <img :src="getCoverUrl(playlist.cover_url)" class="cover" alt="cover" @error="handleImageError" />
      <div class="header-info">
        <h1 class="title">{{ playlist.name }}</h1>
        <div class="meta">
          <span v-if="playlist.username">创建者: {{ playlist.nickname || playlist.username }}</span>
          <span>{{ playlist.song_count || 0 }} 首歌曲</span>
        </div>
        <div class="description" v-if="playlist.description">{{ playlist.description }}</div>
        <div class="actions">
          <el-button type="primary" :icon="VideoPlay" @click="handlePlayAll">播放全部</el-button>
          <el-button :icon="Star" @click="handleFavorite">收藏</el-button>
          <el-button :icon="Share">分享</el-button>
        </div>
      </div>
    </div>

    <div class="playlist-content">
      <div class="song-list-header">
        <span>歌曲列表</span>
        <el-button type="text" @click="handleClear">清空</el-button>
      </div>
      <el-table :data="songs" stripe>
        <el-table-column type="index" label="#" width="60" />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button :icon="VideoPlay" circle size="small" @click="handlePlay(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="歌曲" min-width="200" />
        <el-table-column prop="artist_name" label="歌手" min-width="150" />
        <el-table-column prop="duration" label="时长" width="100">
          <template #default="{ row }">
            {{ formatTime(row.duration) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="text" @click="handleAddToPlaylist(row)">添加到歌单</el-button>
            <el-button type="text" @click="handleFavorite(row)">收藏</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <Loading v-else :loading="loading" text="加载中..." />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPlaylistDetail } from '@/api/playlist'
import { usePlayerStore } from '@/store/player'
import { formatTime } from '@/utils/format'
import { VideoPlay, Star, Share } from '@element-plus/icons-vue'
import { getCoverUrl, handleImageError } from '@/utils/image'
import Loading from '@/components/Loading/index.vue'

const route = useRoute()
const playerStore = usePlayerStore()

const playlist = ref(null)
const songs = ref([])
const loading = ref(true)


const loadPlaylist = async () => {
  try {
    loading.value = true
    const id = route.params.id
    const res = await getPlaylistDetail(id)
    if (res.code === 0 && res.data) {
      playlist.value = res.data
      songs.value = res.data.songs || []
    }
  } catch (error) {
    console.error('加载歌单失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePlayAll = () => {
  if (songs.value.length > 0) {
    playerStore.setPlaylist(songs.value)
    playerStore.play(songs.value[0])
  }
}

const handlePlay = (song) => {
  playerStore.play(song)
}

const handleFavorite = (song) => {
  // TODO: 收藏功能
}

const handleAddToPlaylist = (song) => {
  // TODO: 添加到歌单
}

const handleClear = () => {
  // TODO: 清空歌单
}

onMounted(() => {
  loadPlaylist()
})
</script>

<style lang="scss" scoped>
.playlist-page {
  padding: $spacing-lg;
  max-width: 1400px;
  margin: 0 auto;
}

.playlist-header {
  display: flex;
  gap: $spacing-xl;
  margin-bottom: $spacing-xxl;
  padding: $spacing-xl;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 249, 245, 0.9) 100%);
  border-radius: $radius-lg;
  border: 1px solid rgba(155, 225, 93, 0.2);
  box-shadow: 0 2px 8px rgba(155, 225, 93, 0.1);
}

.cover {
  width: 200px;
  height: 200px;
  border-radius: $radius-lg;
  object-fit: cover;
  flex-shrink: 0;
}

.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: $font-size-xl;
  font-weight: 600;
  margin-bottom: $spacing-md;
  color: $primary-start;
}

.meta {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-md;
  font-size: $font-size-sm;
  color: $text-secondary;
}

.description {
  margin-bottom: $spacing-lg;
  font-size: $font-size-sm;
  color: $text-secondary;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: $spacing-md;
}

.playlist-content {
  background: rgba(255, 255, 255, 0.6);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  border: 1px solid rgba(155, 225, 93, 0.2);

  .song-list-header {
    @include flex-between;
    margin-bottom: $spacing-md;
    font-size: $font-size-md;
    font-weight: 500;
    color: $primary-start;
  }
}

:deep(.el-table) {
  background: transparent;

  .el-table__header {
    background: rgba(155, 225, 93, 0.05);
  }

  .el-table__row {
    &:hover {
      background: rgba(155, 225, 93, 0.1) !important;
    }
  }
}
</style>

