import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getPostsApi, getPostDetailApi, createPostApi, updatePostApi, deletePostApi, createCommentApi, type ForumPost, type ForumListResponse, type CreatePostData, type CreateCommentData } from '@/api/forum'

export const useForumStore = defineStore('forum', () => {
  // 状态
  const posts = ref<ForumPost[]>([])
  const currentPost = ref<ForumPost | null>(null)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 计算属性
  const allPosts = computed(() => posts.value)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)
  const pagination = computed(() => ({
    total: totalCount.value,
    current: currentPage.value,
    pageSize: pageSize.value,
    totalPages: Math.ceil(totalCount.value / pageSize.value)
  }))
  
  // 获取帖子列表
  async function fetchPosts(params?: {
    page?: number
    page_size?: number
  }) {
    loading.value = true
    error.value = null
    
    try {
      const data: ForumListResponse = await getPostsApi({
        ...params,
        page_size: params?.page_size || pageSize.value
      })
      
      posts.value = data.results
      totalCount.value = data.count
      currentPage.value = params?.page || 1
      
      return data
    } catch (err: any) {
      error.value = err.message || '获取帖子列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 获取帖子详情
  async function fetchPostDetail(id: number) {
    loading.value = true
    error.value = null
    
    try {
      const data = await getPostDetailApi(id)
      currentPost.value = data
      return data
    } catch (err: any) {
      error.value = err.message || '获取帖子详情失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 创建帖子
  async function createPost(data: CreatePostData) {
    loading.value = true
    error.value = null
    
    try {
      const newPost = await createPostApi(data)
      posts.value.unshift(newPost)
      totalCount.value++
      return newPost
    } catch (err: any) {
      error.value = err.message || '创建帖子失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 更新帖子
  async function updatePost(id: number, data: Partial<CreatePostData>) {
    loading.value = true
    error.value = null
    
    try {
      const updatedPost = await updatePostApi(id, data)
      
      // 更新本地帖子列表
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value[index] = updatedPost
      }
      
      // 更新当前帖子
      if (currentPost.value?.id === id) {
        currentPost.value = updatedPost
      }
      
      return updatedPost
    } catch (err: any) {
      error.value = err.message || '更新帖子失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 删除帖子
  async function deletePost(id: number) {
    loading.value = true
    error.value = null
    
    try {
      await deletePostApi(id)
      
      // 从本地帖子列表中移除
      posts.value = posts.value.filter(p => p.id !== id)
      totalCount.value--
      
      // 清除当前帖子
      if (currentPost.value?.id === id) {
        currentPost.value = null
      }
    } catch (err: any) {
      error.value = err.message || '删除帖子失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 创建评论
  async function createComment(data: CreateCommentData) {
    loading.value = true
    error.value = null
    
    try {
      const newComment = await createCommentApi(data)
      
      // 更新当前帖子的评论列表
      if (currentPost.value && data.post === currentPost.value.id) {
        if (!currentPost.value.comments) {
          currentPost.value.comments = []
        }
        currentPost.value.comments.push(newComment)
        currentPost.value.reply_count++
      }
      
      return newComment
    } catch (err: any) {
      error.value = err.message || '创建评论失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 重置状态
  function resetState() {
    posts.value = []
    currentPost.value = null
    totalCount.value = 0
    currentPage.value = 1
    pageSize.value = 20
    loading.value = false
    error.value = null
  }
  
  return {
    // 状态
    posts,
    currentPost,
    totalCount,
    currentPage,
    pageSize,
    loading,
    error,
    
    // 计算属性
    allPosts,
    isLoading,
    hasError,
    pagination,
    
    // 方法
    fetchPosts,
    fetchPostDetail,
    createPost,
    updatePost,
    deletePost,
    createComment,
    resetState
  }
})
