import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: {
          title: '仪表盘',
          icon: 'DataAnalysis'
        }
      },
      {
        path: 'songs',
        name: 'Songs',
        component: () => import('@/views/Song/index.vue'),
        meta: {
          title: '音乐管理',
          icon: 'Headset'
        }
      },
      {
        path: 'songs/create',
        name: 'SongCreate',
        component: () => import('@/views/Song/Create.vue'),
        meta: {
          title: '创建音乐',
          hidden: true
        }
      },
      {
        path: 'songs/edit/:id',
        name: 'SongEdit',
        component: () => import('@/views/Song/Edit.vue'),
        meta: {
          title: '编辑音乐',
          hidden: true
        }
      },
      {
        path: 'albums',
        name: 'Albums',
        component: () => import('@/views/Album/index.vue'),
        meta: {
          title: '专辑管理',
          icon: 'Folder'
        }
      },
      {
        path: 'lyrics',
        name: 'Lyrics',
        component: () => import('@/views/Lyric/index.vue'),
        meta: {
          title: '歌词管理',
          icon: 'Document'
        }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/User/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'User'
        }
      },
      {
        path: 'comments',
        name: 'Comments',
        component: () => import('@/views/Comment/index.vue'),
        meta: {
          title: '评论管理',
          icon: 'ChatLineRound'
        }
      },
      {
        path: 'playlists',
        name: 'Playlists',
        component: () => import('@/views/Playlist/index.vue'),
        meta: {
          title: '歌单管理',
          icon: 'List'
        }
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('@/views/Statistics/index.vue'),
        meta: {
          title: '数据统计',
          icon: 'DataLine'
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings/index.vue'),
        meta: {
          title: '系统配置',
          icon: 'Setting'
        }
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('@/views/Log/index.vue'),
        meta: {
          title: '操作日志',
          icon: 'Document'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound/index.vue'),
    meta: {
      title: '404'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - Green Music 后台管理系统` : 'Green Music 后台管理系统'
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!userStore.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    // 如果已登录，访问登录页则跳转到首页
    if (to.name === 'Login' && userStore.isAuthenticated) {
      next({ name: 'Dashboard' })
    } else {
      next()
    }
  }
})

export default router

