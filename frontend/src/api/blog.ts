import api from './axios'

// 类型定义
export interface BlogCategory {
  id: number
  name: string
  slug: string
}

export interface BlogAuthor {
  id: number
  username: string
}

export interface BlogArticle {
  id: number
  title: string
  slug: string
  content: string
  summary: string
  author: BlogAuthor
  category: BlogCategory
  tags: string[]
  status: string
  view_count: number
  like_count: number
  created_at: string
  updated_at: string
}

export interface BlogListResponse {
  count: number
  next: string | null
  previous: string | null
  results: BlogArticle[]
}

export interface CreateArticleData {
  title: string
  content: string
  summary?: string
  category: number
  tags?: string[]
  status?: string
}

// API 方法
export const getArticlesApi = async (params?: {
  category?: string
  page?: number
  page_size?: number
}): Promise<BlogListResponse> => {
  return api.get('/blog/articles/', { params })
}

export const getArticleDetailApi = async (slug: string): Promise<BlogArticle> => {
  return api.get(`/blog/articles/${slug}/`)
}

export const createArticleApi = async (data: CreateArticleData): Promise<BlogArticle> => {
  return api.post('/blog/articles/create/', data)
}

export const updateArticleApi = async (id: number, data: Partial<CreateArticleData>): Promise<BlogArticle> => {
  return api.put(`/blog/articles/${id}/`, data)
}

export const deleteArticleApi = async (id: number): Promise<void> => {
  return api.delete(`/blog/articles/${id}/`)
}

export const getCategoriesApi = async (): Promise<BlogCategory[]> => {
  return api.get('/blog/categories/')
}
