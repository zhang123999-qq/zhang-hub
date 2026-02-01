import api from './axios'

// 类型定义
export interface ResourceSubmitter {
  id: number
  username: string
}

export interface Resource {
  id: number
  title: string
  description: string
  url: string
  type: string
  submitter: ResourceSubmitter
  tags: string[]
  download_count: number
  created_at: string
  updated_at: string
}

export interface ResourceListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Resource[]
}

export interface CreateResourceData {
  title: string
  description: string
  url: string
  type: string
  tags?: string[]
}

// API 方法
export const getResourcesApi = async (params?: {
  type?: string
  page?: number
  page_size?: number
}): Promise<ResourceListResponse> => {
  return api.get('/resources/resources/', { params })
}

export const getResourceDetailApi = async (id: number): Promise<Resource> => {
  return api.get(`/resources/resources/${id}/`)
}

export const createResourceApi = async (data: CreateResourceData): Promise<Resource> => {
  return api.post('/resources/resources/create/', data)
}

export const updateResourceApi = async (id: number, data: Partial<CreateResourceData>): Promise<Resource> => {
  return api.put(`/resources/resources/${id}/`, data)
}

export const deleteResourceApi = async (id: number): Promise<void> => {
  return api.delete(`/resources/resources/${id}/`)
}
