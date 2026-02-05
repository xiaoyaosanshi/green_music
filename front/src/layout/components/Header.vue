<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <router-link to="/home" class="logo">
          <span class="logo-text">Green Music</span>
        </router-link>
        <nav class="nav">
          <router-link to="/home" class="nav-item">首页</router-link>
          <router-link to="/discover" class="nav-item">发现</router-link>
        </nav>
      </div>
      <div class="header-center">
        <SearchBar />
      </div>
      <div class="header-right">
        <template v-if="userStore.isAuthenticated">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar 
                :src="getAvatarUrl(userStore.userInfo)" 
                :size="32"
                @error="handleAvatarError"
              >
                {{ userStore.userInfo?.nickname?.[0] || userStore.userInfo?.username?.[0] || 'U' }}
              </el-avatar>
              <span class="username">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="user">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button type="primary" @click="goToLogin">登录</el-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { User, SwitchButton } from '@element-plus/icons-vue'
import { DEFAULT_COVER } from '@/utils/image'
import SearchBar from '@/components/SearchBar/index.vue'

const router = useRouter()
const userStore = useUserStore()

const goToLogin = () => {
  router.push('/login')
}

const getAvatarUrl = (user) => {
  if (!user?.avatar) return DEFAULT_COVER
  if (user.avatar.startsWith('http')) return user.avatar
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
  return `${baseUrl}${user.avatar}`
}

const handleAvatarError = () => {
  return DEFAULT_COVER
}

const handleCommand = (command) => {
  if (command === 'user') {
    router.push('/user')
  } else if (command === 'logout') {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/home')
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(155, 225, 93, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(155, 225, 93, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  padding: 0 $spacing-lg;
  @include flex-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: $spacing-xl;
}

.logo {
  font-size: $font-size-xl;
  font-weight: bold;
  @include gradient-bg;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: $spacing-lg;
}

.nav-item {
  padding: $spacing-sm $spacing-md;
  color: $text-primary;
  text-decoration: none;
  border-radius: $radius-sm;
  transition: all $transition-fast;

  &:hover {
    background: rgba(155, 225, 93, 0.1);
    color: $primary-start;
  }

  &.router-link-active {
    color: $primary-start;
    font-weight: 500;
    background: rgba(155, 225, 93, 0.15);
  }
}

.header-center {
  flex: 1;
  max-width: 500px;
  margin: 0 $spacing-xl;
}

.header-right {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.user-info {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  cursor: pointer;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-md;
  transition: background $transition-fast;

  &:hover {
    background: rgba(155, 225, 93, 0.1);
  }
}

.username {
  font-size: $font-size-sm;
  color: $text-primary;
}
</style>

