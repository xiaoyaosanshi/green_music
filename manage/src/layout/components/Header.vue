<template>
  <div class="header-container">
    <div class="header-left">
      <el-icon class="collapse-icon" @click="toggleSidebar">
        <Expand v-if="appStore.sidebarCollapsed" />
        <Fold v-else />
      </el-icon>
      <div class="logo">
        <span class="logo-text">Green Music</span>
        <span class="logo-subtitle">后台管理系统</span>
      </div>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32" :src="userStore.adminInfo?.avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <span class="username">{{ userStore.username }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人信息
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

const toggleSidebar = () => {
  appStore.toggleSidebar()
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      // 跳转到个人信息页
      break
    case 'settings':
      router.push({ name: 'Settings' })
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userStore.logout()
    router.push({ name: 'Login' })
  } catch {
    // 用户取消
  }
}
</script>

<style lang="scss" scoped>
.header-container {
  height: $header-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-lg;
  background: $bg-color;
  box-shadow: $box-shadow-base;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  
  .collapse-icon {
    font-size: 20px;
    cursor: pointer;
    color: $text-regular;
    transition: color $transition-base;
    
    &:hover {
      color: $primary-color;
    }
  }
  
  .logo {
    display: flex;
    align-items: baseline;
    gap: $spacing-xs;
    
    .logo-text {
      font-size: $font-size-xl;
      font-weight: 600;
      @include gradient-bg($primary-color, $primary-color-light);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .logo-subtitle {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
}

.header-right {
  .user-info {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    cursor: pointer;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-base;
    transition: background-color $transition-base;
    
    &:hover {
      background-color: $bg-color-page;
    }
    
    .username {
      font-size: $font-size-base;
      color: $text-primary;
    }
  }
}
</style>

