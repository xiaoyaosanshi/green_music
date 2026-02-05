<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

onMounted(() => {
  // 如果已登录，获取管理员信息
  if (userStore.isAuthenticated) {
    userStore.fetchAdminInfo()
  }
})
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>

