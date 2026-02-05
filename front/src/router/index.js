import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home/index.vue'),
        meta: { title: '首页', requiresAuth: false }
      },
      {
        path: '/discover',
        name: 'Discover',
        component: () => import('@/views/Discover/index.vue'),
        meta: { title: '发现音乐', requiresAuth: false }
      },
      {
        path: '/playlist/:id',
        name: 'Playlist',
        component: () => import('@/views/Playlist/index.vue'),
        meta: { title: '歌单详情', requiresAuth: false }
      },
      {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/Search/index.vue'),
        meta: { title: '搜索', requiresAuth: false }
      },
      {
        path: '/user/:id?',
        name: 'User',
        component: () => import('@/views/User/index.vue'),
        meta: { title: '用户中心', requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound/index.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - Green Music` : 'Green Music'

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    const userStore = useUserStore()
    if (!userStore.isAuthenticated) {
      // 尝试检查登录状态
      const isAuth = await userStore.checkAuth()
      if (!isAuth) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
        return
      }
    }
  }

  next()
})

export default router

