<template>
  <div class="sidebar-container" :class="{ 'collapsed': appStore.sidebarCollapsed }">
    <el-menu
      :default-active="activeMenu"
      :collapse="appStore.sidebarCollapsed"
      :collapse-transition="false"
      router
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#9be15d"
    >
      <template v-for="route in menuRoutes" :key="route.path">
        <el-menu-item :index="route.path" v-if="!route.meta.hidden">
          <el-icon>
            <component :is="route.meta.icon" />
          </el-icon>
          <template #title>{{ route.meta.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const activeMenu = computed(() => {
  const { path } = route
  return path
})

const menuRoutes = computed(() => {
  return router.getRoutes().find(r => r.path === '/')?.children || []
})
</script>

<style lang="scss" scoped>
.sidebar-container {
  position: fixed;
  left: 0;
  top: $header-height;
  bottom: 0;
  width: $sidebar-width;
  background-color: #304156;
  transition: width $transition-base;
  overflow-y: auto;
  @include scrollbar(6px, rgba(255, 255, 255, 0.2), transparent);
  z-index: 100;
  
  &.collapsed {
    width: $sidebar-collapsed-width;
  }
  
  :deep(.el-menu) {
    border-right: none;
    height: 100%;
    
    .el-menu-item {
      height: 50px;
      line-height: 50px;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
      
      &.is-active {
        background-color: rgba(155, 225, 93, 0.1) !important;
        color: #9be15d !important;
      }
    }
  }
}
</style>

