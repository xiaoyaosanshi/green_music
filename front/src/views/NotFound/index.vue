<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1>404</h1>
      <p>页面未找到</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/home')
}
</script>

<style lang="scss" scoped>
.not-found-page {
  @include flex-center;
  min-height: 100vh;
}

.not-found-content {
  text-align: center;

  h1 {
    font-size: 120px;
    font-weight: 600;
    @include gradient-bg;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: $spacing-lg;
  }

  p {
    font-size: $font-size-lg;
    color: $text-secondary;
    margin-bottom: $spacing-xl;
  }
}
</style>

