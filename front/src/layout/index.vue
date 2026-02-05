<template>
  <div class="layout-container">
    <Header />
    <div class="layout-content">
      <router-view />
    </div>
    <MusicPlayer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import MusicPlayer from '@/components/MusicPlayer/index.vue'
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.layout-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px; // 为底部播放器留出空间
}
</style>

