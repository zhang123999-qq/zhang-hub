import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, registerApi, logoutApi, refreshTokenApi, type LoginData, type RegisterData, type AuthResponse } from '@/api/auth'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  
  // 状态
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))
  const user = ref<any>(null)
  const lastLogin = ref<number | null>(null)
  const loginAttempts = ref(0)
  const isLocked = ref(false)
  const lockUntil = ref<number | null>(null)
  
  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !isTokenExpired())
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isWriter = computed(() => ['admin', 'editor', 'writer'].includes(user.value?.role))
  const userInfo = computed(() => user.value)
  
  // 检查令牌是否过期
  function isTokenExpired(): boolean {
    if (!token.value) return true
    
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }
  
  // 登录
  async function login(credentials: LoginData): Promise<AuthResponse> {
    try {
      // 检查账户是否被锁定
      if (isLocked.value && lockUntil.value && Date.now() < lockUntil.value) {
        const minutes = Math.ceil((lockUntil.value - Date.now()) / 60000)
        throw new Error(`账户已被锁定，请${minutes}分钟后重试`)
      }
      
      const response = await loginApi(credentials)
      
      // 保存令牌
      token.value = response.access
      refreshToken.value = response.refresh
      user.value = response.user
      lastLogin.value = Date.now()
      
      // 存储到本地
      localStorage.setItem('auth_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      // 重置登录尝试
      loginAttempts.value = 0
      isLocked.value = false
      lockUntil.value = null
      
      return response
    } catch (error: any) {
      // 记录登录尝试
      loginAttempts.value++
      
      if (loginAttempts.value >= 5) {
        isLocked.value = true
        lockUntil.value = Date.now() + 30 * 60 * 1000 // 锁定30分钟
      }
      
      throw error
    }
  }
  
  // 注册
  async function register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await registerApi(userData)
      
      // 自动登录
      token.value = response.access
      refreshToken.value = response.refresh
      user.value = response.user
      
      // 存储到本地
      localStorage.setItem('auth_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (error) {
      throw error
    }
  }
  
  // 登出
  async function logout() {
    try {
      await logoutApi()
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      // 清除状态
      token.value = null
      refreshToken.value = null
      user.value = null
      
      // 清除本地存储
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      
      // 跳转到登录页
      router.push('/login')
    }
  }
  
  // 刷新令牌
  async function refreshTokenRequest(): Promise<void> {
    if (!refreshToken.value) {
      logout()
      return
    }
    
    try {
      const response = await refreshTokenApi({ refresh: refreshToken.value })
      
      token.value = response.access
      localStorage.setItem('auth_token', response.access)
      
      if (response.refresh) {
        refreshToken.value = response.refresh
        localStorage.setItem('refresh_token', response.refresh)
      }
    } catch (error) {
      console.error('刷新令牌失败:', error)
      logout()
    }
  }
  
  // 检查并刷新令牌
  async function checkAndRefreshToken(): Promise<boolean> {
    if (!token.value || isTokenExpired()) {
      if (refreshToken.value) {
        await refreshTokenRequest()
        return true
      }
      return false
    }
    return true
  }
  
  // 初始化用户状态
  function initUser() {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        user.value = null
      }
    }
  }
  
  // 获取用户权限
  function getPermissions(): string[] {
    if (!user.value) return []
    
    const permissions: string[] = []
    if (isAdmin.value) permissions.push('admin')
    if (isWriter.value) permissions.push('write')
    if (user.value.role === 'moderator') permissions.push('moderate')
    
    return permissions
  }
  
  return {
    // 状态
    token,
    refreshToken,
    user,
    lastLogin,
    loginAttempts,
    isLocked,
    lockUntil,
    
    // 计算属性
    isAuthenticated,
    isAdmin,
    isWriter,
    userInfo,
    
    // 方法
    login,
    register,
    logout,
    refreshTokenRequest,
    checkAndRefreshToken,
    initUser,
    getPermissions,
    isTokenExpired
  }
})
