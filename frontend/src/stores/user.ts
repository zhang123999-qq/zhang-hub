import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getProfileApi, updateProfileApi, type UserProfile } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  // 状态
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 计算属性
  const userInfo = computed(() => profile.value)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)
  
  // 获取用户资料
  async function fetchUserInfo() {
    loading.value = true
    error.value = null
    
    try {
      const data = await getProfileApi()
      profile.value = data
      return data
    } catch (err: any) {
      error.value = err.message || '获取用户资料失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 更新用户资料
  async function updateUserInfo(data: Partial<UserProfile>) {
    loading.value = true
    error.value = null
    
    try {
      const updatedData = await updateProfileApi(data)
      profile.value = updatedData
      return updatedData
    } catch (err: any) {
      error.value = err.message || '更新用户资料失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 重置状态
  function resetState() {
    profile.value = null
    loading.value = false
    error.value = null
  }
  
  return {
    // 状态
    profile,
    loading,
    error,
    
    // 计算属性
    userInfo,
    isLoading,
    hasError,
    
    // 方法
    fetchUserInfo,
    updateUserInfo,
    resetState
  }
})
