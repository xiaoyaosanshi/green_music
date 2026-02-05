<template>
  <div class="layout-container">
    <Header />
    <div class="layout-body">
      <Sidebar />
      <div class="layout-main" :class="{ 'collapsed': appStore.sidebarCollapsed }">
        <div class="layout-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
        <Footer />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import Footer from './components/Footer.vue'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: $sidebar-width;
  transition: margin-left $transition-base;
  overflow: hidden;
  
  &.collapsed {
    margin-left: $sidebar-collapsed-width;
  }
}

.layout-content {
  flex: 1;
  overflow-y: auto;
  @include scrollbar();
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

