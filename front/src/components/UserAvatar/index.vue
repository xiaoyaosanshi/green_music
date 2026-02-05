<template>
  <el-avatar :src="avatarUrl" :size="size" :shape="shape" @error="handleAvatarError">
    {{ displayText }}
  </el-avatar>
</template>

<script setup>
import { computed } from 'vue'
import { DEFAULT_COVER } from '@/utils/image'

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  size: {
    type: [Number, String],
    default: 40
  },
  shape: {
    type: String,
    default: 'circle'
  }
})

const avatarUrl = computed(() => {
  if (!props.user?.avatar) return DEFAULT_COVER
  if (props.user.avatar.startsWith('http')) return props.user.avatar
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
  return `${baseUrl}${props.user.avatar}`
})

const displayText = computed(() => {
  if (props.user?.nickname) return props.user.nickname[0].toUpperCase()
  if (props.user?.username) return props.user.username[0].toUpperCase()
  return 'U'
})

const handleAvatarError = () => {
  // el-avatar 会自动处理错误，但我们可以确保使用默认图片
  return DEFAULT_COVER
}
</script>

<style lang="scss" scoped>
// 使用Element Plus默认样式
</style>

