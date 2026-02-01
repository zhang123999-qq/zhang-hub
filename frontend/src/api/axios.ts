import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// API响应类型
export interface ApiResponse<T = any> {
  status: string
  data: T
  message?: string
}

// API错误类型
export interface ApiError {
  code: number
  message: string
  details?: any
}

// 创建axios实例
const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 30000, // 30秒超时
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: false // 不发送cookie
  })
  
  // 请求拦截器
  instance.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      // 添加认证令牌
      const token = localStorage.getItem('auth_token')
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      
      // 添加安全头
      if (config.headers) {
        config.headers['X-CSRF-Protection'] = '1'
        config.headers['X-Content-Type-Options'] = 'nosniff'
        
        // 添加请求ID（用于日志追踪）
        config.headers['X-Request-ID'] = generateRequestId()
      }
      
      // 如果是文件上传，使用multipart/form-data
      if (config.data instanceof FormData && config.headers) {
        config.headers['Content-Type'] = 'multipart/form-data'
      }
      
      console.log(`📤 请求: ${config.method?.toUpperCase()} ${config.url}`, config.params || '')
      
      return config
    },
    (error) => {
      console.error('请求错误:', error)
      return Promise.reject(error)
    }
  )
  
  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      console.log(`📥 响应: ${response.status} ${response.config.url}`, response.data)
      
      // 处理成功的响应
      if (response.data.status === 'success') {
        return response.data.data
      }
      
      // 处理业务错误
      const error: ApiError = {
        code: 400,
        message: response.data.message || '请求失败',
        details: response.data
      }
      
      return Promise.reject(error)
    },
    async (error) => {
      // 处理HTTP错误
      if (error.response) {
        const { status, data } = error.response
        
        console.error(`❌ HTTP错误 ${status}:`, data)
        
        const errorMessage = data?.message || `请求失败 (${status})`
        
        // 处理401错误（未认证）
        if (status === 401) {
          // 清除本地存储的令牌
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
          // 跳转到登录页
          window.location.href = '/login'
        }
        
        const apiError: ApiError = {
          code: status,
          message: errorMessage,
          details: data
        }
        
        return Promise.reject(apiError)
      } else if (error.request) {
        // 请求已发出但没有收到响应
        console.error('网络错误:', error.message)
        const networkError: ApiError = {
          code: 0,
          message: '网络连接失败，请检查网络设置'
        }
        return Promise.reject(networkError)
      } else {
        // 请求配置错误
        console.error('请求配置错误:', error.message)
        const configError: ApiError = {
          code: 0,
          message: '请求配置错误'
        }
        return Promise.reject(configError)
      }
    }
  )
  
  return instance
}

// 生成请求ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 创建API实例
const api = createAxiosInstance(import.meta.env.VITE_API_URL || 'http://localhost:8000/api')

export default api
