<template>
  <div class="home-page">
    <div class="banner-section">
      <el-carousel height="300px" indicator-position="outside" v-if="displayBanners.length > 0">
        <el-carousel-item v-for="item in displayBanners" :key="item.id">
          <div 
            class="banner-item" 
            :style="{ backgroundImage: `url(${getBannerImage(item.image)}), url(${defaultBanner})` }"
          >
            <div class="banner-content">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div v-else class="banner-placeholder">
        <div class="banner-item" :style="{ backgroundImage: `url(${defaultBanner})` }">
          <div class="banner-content">
            <h2>欢迎来到 Green Music</h2>
            <p>发现好音乐，享受美好时光</p>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <section class="section">
        <h3 class="section-title">推荐歌单</h3>
        <div class="playlist-grid">
          <PlaylistCard
            v-for="playlist in recommendPlaylists"
            :key="playlist.id"
            :playlist="playlist"
            @play="handlePlayPlaylist"
          />
        </div>
      </section>

      <section class="section">
        <h3 class="section-title">最新音乐</h3>
        <div class="song-list">
          <MusicCard
            v-for="song in newSongs"
            :key="song.id"
            :song="song"
            @play="handlePlaySong"
          />
        </div>
      </section>

      <section class="section">
        <h3 class="section-title">热门歌曲</h3>
        <div class="song-list">
          <MusicCard
            v-for="song in hotSongs"
            :key="song.id"
            :song="song"
            @play="handlePlaySong"
          />
        </div>
      </section>

      <section class="section" v-if="personalRecommend.length > 0">
        <h3 class="section-title">为你推荐</h3>
        <div class="song-list">
          <MusicCard
            v-for="song in personalRecommend"
            :key="song.id"
            :song="song"
            @play="handlePlaySong"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getHotRecommend, getPersonalRecommend } from '@/api/recommend'
import { getSongList } from '@/api/song'
import { getPlaylistList } from '@/api/playlist'
import { usePlayerStore } from '@/store/player'
import { DEFAULT_COVER } from '@/utils/image'
import PlaylistCard from '@/components/PlaylistCard/index.vue'
import MusicCard from '@/components/MusicCard/index.vue'

const playerStore = usePlayerStore()

const banners = ref([])
const recommendPlaylists = ref([])
const newSongs = ref([])
const hotSongs = ref([])
const personalRecommend = ref([])

const defaultBanner = DEFAULT_COVER

// 显示用的轮播图数据，如果没有数据则使用默认
const displayBanners = computed(() => {
  if (banners.value.length > 0) {
    return banners.value
  }
  // 如果没有轮播图数据，返回一个默认的
  return [
    {
      id: 'default',
      title: '欢迎来到 Green Music',
      description: '发现好音乐，享受美好时光',
      image: defaultBanner
    }
  ]
})

// 获取轮播图图片URL，带兜底处理
const getBannerImage = (imageUrl) => {
  if (!imageUrl) return defaultBanner
  if (imageUrl.startsWith('http')) return imageUrl
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
  return `${baseUrl}${imageUrl}`
}

const loadData = async () => {
  try {
    // 获取推荐歌单作为轮播图数据
    const playlistRes = await getPlaylistList({ page: 1, pageSize: 10 })
    if (playlistRes.code === 0 && playlistRes.data.list) {
      recommendPlaylists.value = playlistRes.data.list || []
      // 将推荐歌单转换为轮播图数据（取前5个）
      banners.value = playlistRes.data.list.slice(0, 5).map((playlist) => ({
        id: playlist.id,
        title: playlist.name,
        description: playlist.description || `${playlist.song_count || 0} 首歌曲`,
        image: playlist.cover_url
      }))
    }

    // 获取最新音乐
    const newSongsRes = await getSongList({ page: 1, pageSize: 20 })
    if (newSongsRes.code === 0) {
      newSongs.value = newSongsRes.data.list || []
    }

    // 获取热门歌曲
    const hotRes = await getHotRecommend({ type: 'song', limit: 20 })
    if (hotRes.code === 0) {
      hotSongs.value = hotRes.data.list || []
    }

    // 获取个性化推荐
    const personalRes = await getPersonalRecommend({ type: 'song', limit: 10 })
    if (personalRes.code === 0) {
      personalRecommend.value = personalRes.data.recommendations?.map((r) => r.song) || []
    }
  } catch (error) {
    console.error('加载首页数据失败:', error)
  }
}

const handlePlaySong = (song) => {
  playerStore.play(song)
}

const handlePlayPlaylist = (playlist) => {
  // TODO: 获取歌单歌曲并播放
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.home-page {
  padding: $spacing-lg;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 60px);
}

.banner-section {
  margin-bottom: $spacing-xl;
  border-radius: $radius-lg;
  overflow: hidden;
}

.banner-item {
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  @include flex-center;
  position: relative;
  min-height: 300px;

  // 如果背景图加载失败，使用默认图片作为后备
  background-image: var(--banner-bg, url('/1309624.jpeg'));

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(155, 225, 93, 0.4) 0%,
      rgba(0, 227, 174, 0.3) 100%
    );
    z-index: 0;
  }
}

.banner-placeholder {
  height: 300px;
  border-radius: $radius-lg;
  overflow: hidden;
}

.banner-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: $text-white;

  h2 {
    font-size: $font-size-xl;
    margin-bottom: $spacing-md;
  }

  p {
    font-size: $font-size-md;
  }
}

.content-section {
  .section {
    margin-bottom: $spacing-xxl;
  }
}

.section-title {
  font-size: $font-size-lg;
  font-weight: 600;
  margin-bottom: $spacing-lg;
  color: $primary-start;
  position: relative;
  padding-left: $spacing-md;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 18px;
    @include gradient-bg;
    border-radius: 2px;
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

