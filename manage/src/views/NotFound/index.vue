<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="not-found-code">404</div>
      <div class="not-found-text">页面不存在</div>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'Dashboard' })
}
</script>

<style lang="scss" scoped>
.not-found-container {
  width: 100%;
  height: 100%;
  @include center();
  
  .not-found-content {
    text-align: center;
    
    .not-found-code {
      font-size: 120px;
      font-weight: 600;
      @include gradient-bg($primary-color, $primary-color-light);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: $spacing-md;
    }
    
    .not-found-text {
      font-size: $font-size-lg;
      color: $text-secondary;
      margin-bottom: $spacing-lg;
    }
  }
}
</style>

