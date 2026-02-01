import { defineStore } from 'pinia'
import { getResourcesApi, getResourceDetailApi } from '@/api/resources'

interface Resource {
  id: number
  title: string
  description: string
  type: string
  category: string
  download_url: string
  submitter: {
    id: number
    username: string
  }
  download_count: number
  created_at: string
}

interface ResourceState {
  resources: Resource[]
  currentResource: Resource | null
  loading: boolean
  error: string | null
  total: number
  page: number
  pageSize: number
}

export const useResourceStore = defineStore('resource', {
  state: (): ResourceState => ({
    resources: [],
    currentResource: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    pageSize: 12
  }),

  getters: {
    allResources: (state) => state.resources,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    errorMessage: (state) => state.error,
    resourceCount: (state) => state.total,
    currentPage: (state) => state.page,
    resourcesPerPage: (state) => state.pageSize
  },

  actions: {
    async fetchResources(params?: any) {
      this.loading = true
      this.error = null

      try {
        const response = await getResourcesApi({
          page: params?.page || this.page,
          page_size: params?.pageSize || this.pageSize,
          category: params?.category,
          type: params?.type,
          keyword: params?.keyword
        })

        this.resources = response.results || []
        this.total = response.count || 0
        this.page = params?.page || this.page
        this.pageSize = params?.pageSize || this.pageSize
      } catch (error: any) {
        this.error = error.message || '获取资源列表失败'
        console.error('获取资源列表失败:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchResourceDetail(id: number) {
      this.loading = true
      this.error = null

      try {
        const resource = await getResourceDetailApi(id)
        this.currentResource = resource
      } catch (error: any) {
        this.error = error.message || '获取资源详情失败'
        console.error('获取资源详情失败:', error)
      } finally {
        this.loading = false
      }
    },

    setPage(page: number) {
      this.page = page
    },

    setPageSize(pageSize: number) {
      this.pageSize = pageSize
    },

    clearError() {
      this.error = null
    },

    clearCurrentResource() {
      this.currentResource = null
    }
  }
})
