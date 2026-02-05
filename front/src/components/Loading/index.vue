<template>
  <div class="loading-container" v-if="loading">
    <el-icon class="loading-icon" :size="size">
      <Loading />
    </el-icon>
    <div v-if="text" class="loading-text">{{ text }}</div>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'

defineProps({
  loading: {
    type: Boolean,
    default: true
  },
  text: {
    type: String,
    default: ''
  },
  size: {
    type: [Number, String],
    default: 24
  }
})
</script>

<style lang="scss" scoped>
.loading-container {
  @include flex-center;
  flex-direction: column;
  gap: $spacing-md;
  padding: $spacing-xl;
}

.loading-icon {
  animation: rotate 1s linear infinite;
  color: $primary-start;
}

.loading-text {
  font-size: $font-size-sm;
  color: $primary-start;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

