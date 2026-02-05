import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

export function useAuth() {
  const router = useRouter()
  const userStore = useUserStore()

  const isAuthenticated = computed(() => userStore.isAuthenticated)
  const userInfo = computed(() => userStore.userInfo)

  const login = async (identity, password) => {
    try {
      await userStore.login(identity, password)
      return true
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    userStore.logout()
    router.push('/login')
  }

  const checkAuth = async () => {
    return await userStore.checkAuth()
  }

  return {
    isAuthenticated,
    userInfo,
    login,
    logout,
    checkAuth
  }
}

