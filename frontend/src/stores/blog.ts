import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getArticlesApi, getArticleDetailApi, createArticleApi, updateArticleApi, deleteArticleApi, type BlogArticle, type BlogListResponse, type CreateArticleData } from '@/api/blog'

export const useBlogStore = defineStore('blog', () => {
  // 状态
  const articles = ref<BlogArticle[]>([])
  const currentArticle = ref<BlogArticle | null>(null)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 计算属性
  const allArticles = computed(() => articles.value)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)
  const pagination = computed(() => ({
    total: totalCount.value,
    current: currentPage.value,
    pageSize: pageSize.value,
    totalPages: Math.ceil(totalCount.value / pageSize.value)
  }))
  
  // 获取文章列表
  async function fetchArticles(params?: {
    category?: string
    page?: number
    page_size?: number
  }) {
    loading.value = true
    error.value = null
    
    try {
      const data: BlogListResponse = await getArticlesApi({
        ...params,
        page_size: params?.page_size || pageSize.value
      })
      
      articles.value = data.results
      totalCount.value = data.count
      currentPage.value = params?.page || 1
      
      return data
    } catch (err: any) {
      error.value = err.message || '获取文章列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 获取文章详情
  async function fetchArticleDetail(slug: string) {
    loading.value = true
    error.value = null
    
    try {
      const data = await getArticleDetailApi(slug)
      currentArticle.value = data
      return data
    } catch (err: any) {
      error.value = err.message || '获取文章详情失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 创建文章
  async function createArticle(data: CreateArticleData) {
    loading.value = true
    error.value = null
    
    try {
      const newArticle = await createArticleApi(data)
      articles.value.unshift(newArticle)
      totalCount.value++
      return newArticle
    } catch (err: any) {
      error.value = err.message || '创建文章失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 更新文章
  async function updateArticle(id: number, data: Partial<CreateArticleData>) {
    loading.value = true
    error.value = null
    
    try {
      const updatedArticle = await updateArticleApi(id, data)
      
      // 更新本地文章列表
      const index = articles.value.findIndex(a => a.id === id)
      if (index !== -1) {
        articles.value[index] = updatedArticle
      }
      
      // 更新当前文章
      if (currentArticle.value?.id === id) {
        currentArticle.value = updatedArticle
      }
      
      return updatedArticle
    } catch (err: any) {
      error.value = err.message || '更新文章失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 删除文章
  async function deleteArticle(id: number) {
    loading.value = true
    error.value = null
    
    try {
      await deleteArticleApi(id)
      
      // 从本地文章列表中移除
      articles.value = articles.value.filter(a => a.id !== id)
      totalCount.value--
      
      // 清除当前文章
      if (currentArticle.value?.id === id) {
        currentArticle.value = null
      }
    } catch (err: any) {
      error.value = err.message || '删除文章失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 重置状态
  function resetState() {
    articles.value = []
    currentArticle.value = null
    totalCount.value = 0
    currentPage.value = 1
    pageSize.value = 20
    loading.value = false
    error.value = null
  }
  
  return {
    // 状态
    articles,
    currentArticle,
    totalCount,
    currentPage,
    pageSize,
    loading,
    error,
    
    // 计算属性
    allArticles,
    isLoading,
    hasError,
    pagination,
    
    // 方法
    fetchArticles,
    fetchArticleDetail,
    createArticle,
    updateArticle,
    deleteArticle,
    resetState
  }
})
