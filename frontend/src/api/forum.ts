import api from './axios'

// 类型定义
export interface ForumAuthor {
  id: number
  username: string
}

export interface ForumComment {
  id: number
  content: string
  author: ForumAuthor
  created_at: string
}

export interface ForumPost {
  id: number
  title: string
  content: string
  author: ForumAuthor
  tags: string[]
  view_count: number
  reply_count: number
  created_at: string
  updated_at: string
  comments?: ForumComment[]
}

export interface ForumListResponse {
  count: number
  next: string | null
  previous: string | null
  results: ForumPost[]
}

export interface CreatePostData {
  title: string
  content: string
  tags?: string[]
}

export interface CreateCommentData {
  content: string
  post?: number
  article?: number
  parent?: number
}

// API 方法
export const getPostsApi = async (params?: {
  page?: number
  page_size?: number
}): Promise<ForumListResponse> => {
  return api.get('/forum/posts/', { params })
}

export const getPostDetailApi = async (id: number): Promise<ForumPost> => {
  return api.get(`/forum/posts/${id}/`)
}

export const createPostApi = async (data: CreatePostData): Promise<ForumPost> => {
  return api.post('/forum/posts/create/', data)
}

export const updatePostApi = async (id: number, data: Partial<CreatePostData>): Promise<ForumPost> => {
  return api.put(`/forum/posts/${id}/`, data)
}

export const deletePostApi = async (id: number): Promise<void> => {
  return api.delete(`/forum/posts/${id}/`)
}

export const createCommentApi = async (data: CreateCommentData): Promise<ForumComment> => {
  return api.post('/forum/comments/create/', data)
}
