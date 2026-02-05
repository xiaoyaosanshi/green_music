<template>
  <div class="search-page">
    <div class="search-header">
      <h2>搜索结果</h2>
      <div class="search-tabs">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="歌曲" name="song" />
          <el-tab-pane label="歌单" name="playlist" />
        </el-tabs>
      </div>
    </div>

    <div class="search-content">
      <div v-if="activeTab === 'song'" class="song-results">
        <div v-if="songResults.length > 0" class="result-list">
          <MusicCard
            v-for="song in songResults"
            :key="song.id"
            :song="song"
            @play="handlePlaySong"
          />
        </div>
        <el-empty v-else description="暂无结果" />
        <el-pagination
          v-model:current-page="songPage"
          v-model:page-size="songPageSize"
          :total="songTotal"
          layout="prev, pager, next"
          @current-change="loadSongs"
        />
      </div>

      <div v-if="activeTab === 'playlist'" class="playlist-results">
        <div v-if="playlistResults.length > 0" class="result-grid">
          <PlaylistCard
            v-for="playlist in playlistResults"
            :key="playlist.id"
            :playlist="playlist"
            @play="handlePlayPlaylist"
          />
        </div>
        <el-empty v-else description="暂无结果" />
        <el-pagination
          v-model:current-page="playlistPage"
          v-model:page-size="playlistPageSize"
          :total="playlistTotal"
          layout="prev, pager, next"
          @current-change="loadPlaylists"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getSongList } from '@/api/song'
import { getPlaylistList } from '@/api/playlist'
import { usePlayerStore } from '@/store/player'
import MusicCard from '@/components/MusicCard/index.vue'
import PlaylistCard from '@/components/PlaylistCard/index.vue'

const route = useRoute()
const playerStore = usePlayerStore()

const activeTab = ref('song')
const keyword = ref('')

const songResults = ref([])
const songPage = ref(1)
const songPageSize = ref(20)
const songTotal = ref(0)

const playlistResults = ref([])
const playlistPage = ref(1)
const playlistPageSize = ref(20)
const playlistTotal = ref(0)

const loadSongs = async () => {
  if (!keyword.value) return
  try {
    const res = await getSongList({
      keyword: keyword.value,
      page: songPage.value,
      pageSize: songPageSize.value
    })
    if (res.code === 0) {
      songResults.value = res.data.list || []
      songTotal.value = res.data.total || 0
    }
  } catch (error) {
    console.error('搜索歌曲失败:', error)
  }
}

const loadPlaylists = async () => {
  if (!keyword.value) return
  try {
    const res = await getPlaylistList({
      keyword: keyword.value,
      page: playlistPage.value,
      pageSize: playlistPageSize.value
    })
    if (res.code === 0) {
      playlistResults.value = res.data.list || []
      playlistTotal.value = res.data.total || 0
    }
  } catch (error) {
    console.error('搜索歌单失败:', error)
  }
}

const handleTabChange = () => {
  if (activeTab.value === 'song') {
    loadSongs()
  } else {
    loadPlaylists()
  }
}

const handlePlaySong = (song) => {
  playerStore.play(song)
}

const handlePlayPlaylist = (playlist) => {
  // TODO: 获取歌单歌曲并播放
}

watch(
  () => route.query.keyword,
  (newKeyword) => {
    keyword.value = newKeyword || ''
    if (keyword.value) {
      songPage.value = 1
      playlistPage.value = 1
      if (activeTab.value === 'song') {
        loadSongs()
      } else {
        loadPlaylists()
      }
    }
  },
  { immediate: true }
)

onMounted(() => {
  keyword.value = route.query.keyword || ''
  if (keyword.value) {
    loadSongs()
  }
})
</script>

<style lang="scss" scoped>
.search-page {
  padding: $spacing-lg;
  max-width: 1400px;
  margin: 0 auto;
}

.search-header {
  margin-bottom: $spacing-xl;

  h2 {
    font-size: $font-size-xl;
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
      height: 20px;
      @include gradient-bg;
      border-radius: 2px;
    }
  }
}

.search-content {
  .result-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    margin-bottom: $spacing-lg;
  }

  .result-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: $spacing-lg;
    margin-bottom: $spacing-lg;
  }
}
</style>

