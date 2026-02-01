import { useAuthStore } from './auth'
import { useUserStore } from './user'
import { useBlogStore } from './blog'
import { useForumStore } from './forum'
import { useResourceStore } from './resource'

// 统一导出所有store
export const useStore = () => ({
  auth: useAuthStore(),
  user: useUserStore(),
  blog: useBlogStore(),
  forum: useForumStore(),
  resource: useResourceStore()
})

export {
  useAuthStore,
  useUserStore,
  useBlogStore,
  useForumStore,
  useResourceStore
}
