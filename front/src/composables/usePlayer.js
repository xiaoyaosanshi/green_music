import { computed } from 'vue'
import { usePlayerStore } from '@/store/player'

export function usePlayer() {
  const playerStore = usePlayerStore()

  const play = (song) => {
    playerStore.play(song)
  }

  const pause = () => {
    playerStore.pause()
  }

  const resume = () => {
    playerStore.resume()
  }

  const next = () => {
    playerStore.next()
  }

  const prev = () => {
    playerStore.prev()
  }

  const setVolume = (volume) => {
    playerStore.setVolume(volume)
  }

  const setPlayMode = (mode) => {
    playerStore.setPlayMode(mode)
  }

  return {
    currentSong: computed(() => playerStore.currentSong),
    isPlaying: computed(() => playerStore.isPlaying),
    playlist: computed(() => playerStore.playlist),
    volume: computed(() => playerStore.volume),
    playMode: computed(() => playerStore.playMode),
    hasNext: computed(() => playerStore.hasNext),
    hasPrev: computed(() => playerStore.hasPrev),
    play,
    pause,
    resume,
    next,
    prev,
    setVolume,
    setPlayMode
  }
}

