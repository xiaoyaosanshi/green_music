<template>
  <div class="user-page">
    <div class="user-header">
      <el-avatar :src="getAvatarUrl(userInfo)" :size="100">
        {{ userInfo?.nickname?.[0] || userInfo?.username?.[0] || 'U' }}
      </el-avatar>
      <div class="user-info">
        <h2>{{ userInfo?.nickname || userInfo?.username }}</h2>
        <p>{{ userInfo?.email }}</p>
      </div>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="我的歌单" name="playlists">
        <div class="playlist-grid">
          <PlaylistCard
            v-for="playlist in myPlaylists"
            :key="playlist.id"
            :playlist="playlist"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="收藏的歌单" name="favorites">
        <div class="playlist-grid">
          <PlaylistCard
            v-for="playlist in favoritePlaylists"
            :key="playlist.id"
            :playlist="playlist"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="最近播放" name="history">
        <div class="song-list">
          <MusicCard
            v-for="song in playHistory"
            :key="song.id"
            :song="song"
            @play="handlePlaySong"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="favoriteSongs">
        <div class="song-list">
          <MusicCard
            v-for="song in favoriteSongs"
            :key="song.id"
            :song="song"
            @play="handlePlaySong"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { usePlayerStore } from '@/store/player'
import { getPlayHistory } from '@/api/user'
import { getFavoriteList } from '@/api/favorite'
import { getPlaylistList } from '@/api/playlist'
import { getCoverUrl, handleImageError } from '@/utils/image'
import PlaylistCard from '@/components/PlaylistCard/index.vue'
import MusicCard from '@/components/MusicCard/index.vue'

const userStore = useUserStore()
const playerStore = usePlayerStore()

const activeTab = ref('playlists')
const myPlaylists = ref([])
const favoritePlaylists = ref([])
const playHistory = ref([])
const favoriteSongs = ref([])

const userInfo = computed(() => userStore.userInfo)

const getAvatarUrl = (user) => {
  if (!user?.avatar) return '/1309624.jpeg'
  if (user.avatar.startsWith('http')) return user.avatar
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
  return `${baseUrl}${user.avatar}`
}

const loadMyPlaylists = async () => {
  try {
    const res = await getPlaylistList({ userId: userInfo.value?.id, page: 1, pageSize: 100 })
    if (res.code === 0) {
      myPlaylists.value = res.data.list || []
    }
  } catch (error) {
    console.error('加载我的歌单失败:', error)
  }
}

const loadPlayHistory = async () => {
  try {
    const res = await getPlayHistory({ page: 1, pageSize: 50 })
    if (res.code === 0) {
      playHistory.value = res.data.list || []
    }
  } catch (error) {
    console.error('加载播放历史失败:', error)
  }
}

const loadFavoriteSongs = async () => {
  try {
    const res = await getFavoriteList({ page: 1, pageSize: 50 })
    if (res.code === 0) {
      favoriteSongs.value = res.data.list || []
    }
  } catch (error) {
    console.error('加载收藏歌曲失败:', error)
  }
}

const handlePlaySong = (song) => {
  playerStore.play(song)
}

onMounted(() => {
  loadMyPlaylists()
  loadPlayHistory()
  loadFavoriteSongs()
})
</script>

<style lang="scss" scoped>
.user-page {
  padding: $spacing-lg;
  max-width: 1400px;
  margin: 0 auto;
}

.user-header {
  display: flex;
  align-items: center;
  gap: $spacing-xl;
  margin-bottom: $spacing-xxl;
  padding: $spacing-xl;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 249, 245, 0.9) 100%);
  border-radius: $radius-lg;
  border: 1px solid rgba(155, 225, 93, 0.2);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(155, 225, 93, 0.1);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    @include gradient-bg;
  }
}

.user-info {
  h2 {
    font-size: $font-size-xl;
    font-weight: 600;
    margin-bottom: $spacing-sm;
  }

  p {
    color: $text-secondary;
  }
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-lg;
}

.song-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}
</style>

