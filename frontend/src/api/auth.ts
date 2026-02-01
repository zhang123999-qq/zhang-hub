import api from './axios'

// 类型定义
export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  password2: string
  role?: string
}

export interface UserProfile {
  id: number
  username: string
  email: string
  role: string
  bio: string
  github_url: string
  skills: string[]
  reputation: number
  is_active: boolean
}

export interface AuthResponse {
  access: string
  refresh: string
  user: UserProfile
}

// API 方法
export const loginApi = async (data: LoginData): Promise<AuthResponse> => {
  return api.post('/users/login/', data)
}

export const registerApi = async (data: RegisterData): Promise<AuthResponse> => {
  return api.post('/users/register/', data)
}

export const refreshTokenApi = async (data: { refresh: string }): Promise<{ access: string }> => {
  return api.post('/users/refresh/', data)
}

export const getProfileApi = async (): Promise<UserProfile> => {
  return api.get('/users/profile/')
}

export const updateProfileApi = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  return api.put('/users/profile/', data)
}

export const logoutApi = async (): Promise<void> => {
  return api.post('/users/logout/')
}
