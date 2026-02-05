import { computed } from 'vue'
import { usePlaylistStore } from '@/store/playlist'

export function usePlaylist() {
  const playlistStore = usePlaylistStore()

  const myPlaylists = computed(() => playlistStore.myPlaylists)
  const favoritePlaylists = computed(() => playlistStore.favoritePlaylists)
  const currentPlaylist = computed(() => playlistStore.currentPlaylist)

  const fetchMyPlaylists = async (params) => {
    return await playlistStore.fetchMyPlaylists(params)
  }

  const fetchFavoritePlaylists = async (params) => {
    return await playlistStore.fetchFavoritePlaylists(params)
  }

  const fetchPlaylistDetail = async (id) => {
    return await playlistStore.fetchPlaylistDetail(id)
  }

  const createPlaylist = (data) => {
    return playlistStore.createPlaylist(data)
  }

  const updatePlaylist = (id, data) => {
    playlistStore.updatePlaylist(id, data)
  }

  const deletePlaylist = (id) => {
    playlistStore.deletePlaylist(id)
  }

  return {
    myPlaylists,
    favoritePlaylists,
    currentPlaylist,
    fetchMyPlaylists,
    fetchFavoritePlaylists,
    fetchPlaylistDetail,
    createPlaylist,
    updatePlaylist,
    deletePlaylist
  }
}

