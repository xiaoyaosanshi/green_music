<template>
  <div class="discover-page">
    <div class="category-nav">
      <el-tabs v-model="activeCategory" @tab-change="handleCategoryChange">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane v-for="genre in genres" :key="genre.id" :label="genre.name" :name="genre.id" />
      </el-tabs>
    </div>

    <div class="content-section">
      <section class="section">
        <h3 class="section-title">歌单推荐</h3>
        <div class="playlist-grid">
          <PlaylistCard
            v-for="playlist in playlists"
            :key="playlist.id"
            :playlist="playlist"
            @play="handlePlayPlaylist"
          />
        </div>
        <el-pagination
          v-model:current-page="playlistPage"
          v-model:page-size="playlistPageSize"
          :total="playlistTotal"
          layout="prev, pager, next"
          @current-change="loadPlaylists"
        />
      </section>

      <section class="section">
        <h3 class="section-title">新歌速递</h3>
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
        <h3 class="section-title">排行榜</h3>
        <div class="ranking-list">
          <div
            v-for="(song, index) in rankingSongs"
            :key="song.id"
            class="ranking-item"
            @click="handlePlaySong(song)"
          >
            <div class="rank" :class="{ top3: index < 3 }">{{ index + 1 }}</div>
            <img :src="getCoverUrl(song.cover_url)" class="cover" alt="cover" @error="handleImageError" />
            <div class="info">
              <div class="title">{{ song.title }}</div>
              <div class="artist">{{ song.artist_name }}</div>
            </div>
            <div class="play-count">{{ formatNumber(song.play_count || 0) }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPlaylistList } from '@/api/playlist'
import { getSongList } from '@/api/song'
import { getHotRecommend } from '@/api/recommend'
import { usePlayerStore } from '@/store/player'
import { formatNumber } from '@/utils/format'
import { getCoverUrl, handleImageError } from '@/utils/image'
import PlaylistCard from '@/components/PlaylistCard/index.vue'
import MusicCard from '@/components/MusicCard/index.vue'

const playerStore = usePlayerStore()

const activeCategory = ref('all')
const genres = ref([])
const playlists = ref([])
const playlistPage = ref(1)
const playlistPageSize = ref(20)
const playlistTotal = ref(0)
const newSongs = ref([])
const rankingSongs = ref([])


const loadPlaylists = async () => {
  try {
    const params = {
      page: playlistPage.value,
      pageSize: playlistPageSize.value
    }
    if (activeCategory.value !== 'all') {
      params.genreId = activeCategory.value
    }
    const res = await getPlaylistList(params)
    if (res.code === 0) {
      playlists.value = res.data.list || []
      playlistTotal.value = res.data.total || 0
    }
  } catch (error) {
    console.error('加载歌单失败:', error)
  }
}

const loadNewSongs = async () => {
  try {
    const res = await getSongList({ page: 1, pageSize: 20 })
    if (res.code === 0) {
      newSongs.value = res.data.list || []
    }
  } catch (error) {
    console.error('加载新歌失败:', error)
  }
}

const loadRanking = async () => {
  try {
    const res = await getHotRecommend({ type: 'song', limit: 20 })
    if (res.code === 0) {
      rankingSongs.value = res.data.list || []
    }
  } catch (error) {
    console.error('加载排行榜失败:', error)
  }
}

const handleCategoryChange = () => {
  playlistPage.value = 1
  loadPlaylists()
}

const handlePlaySong = (song) => {
  playerStore.play(song)
}

const handlePlayPlaylist = (playlist) => {
  // TODO: 获取歌单歌曲并播放
}

onMounted(() => {
  loadPlaylists()
  loadNewSongs()
  loadRanking()
})
</script>

<style lang="scss" scoped>
.discover-page {
  padding: $spacing-lg;
  max-width: 1400px;
  margin: 0 auto;
}

.category-nav {
  margin-bottom: $spacing-xl;
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
  margin-bottom: $spacing-lg;
}

.song-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(155, 225, 93, 0.1);
    transform: translateX(4px);

    .title {
      color: $primary-start;
    }
  }
}

.rank {
  width: 30px;
  text-align: center;
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-secondary;

  &.top3 {
    color: $primary-start;
  }
}

.cover {
  width: 50px;
  height: 50px;
  border-radius: $radius-sm;
  object-fit: cover;
}

.info {
  flex: 1;
  min-width: 0;
}

.title {
  font-size: $font-size-sm;
  color: $text-primary;
  @include text-ellipsis;
  margin-bottom: $spacing-xs;
  transition: color $transition-fast;
}

.artist {
  font-size: $font-size-xs;
  color: $text-secondary;
  @include text-ellipsis;
}

.play-count {
  font-size: $font-size-xs;
  color: $text-secondary;
}
</style>

