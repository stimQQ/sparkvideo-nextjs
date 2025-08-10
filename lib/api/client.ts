import { APIResponse } from '@/types/models'

// API配置
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_VERSION = '/api/v1'

// 请求选项接口
interface RequestOptions extends RequestInit {
  token?: string
  params?: Record<string, any>
}

// API错误类
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// API客户端类
class APIClient {
  private token: string | null = null
  
  // 设置认证token
  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }
  
  // 获取token
  getToken(): string | null {
    if (this.token) return this.token
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
    
    return this.token
  }
  
  // 构建完整URL
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = `${API_BASE}${API_VERSION}${endpoint}`
    
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      return `${url}?${searchParams.toString()}`
    }
    
    return url
  }
  
  // 通用请求方法
  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, token, ...fetchOptions } = options
    
    const url = this.buildURL(endpoint, params)
    const authToken = token || this.getToken()
    
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...fetchOptions.headers,
      },
    })
    
    // 处理响应
    const contentType = response.headers.get('content-type')
    let data: any
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }
    
    // 错误处理
    if (!response.ok) {
      throw new APIError(
        response.status,
        data.detail || data.message || 'Request failed',
        data
      )
    }
    
    return data
  }
  
  // GET请求
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      params,
    })
  }
  
  // POST请求
  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
  
  // PUT请求
  async put<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
  
  // DELETE请求
  async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }
  
  // 上传文件
  async upload<T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }
    
    const response = await fetch(this.buildURL(endpoint), {
      method: 'POST',
      headers: {
        ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
      },
      body: formData,
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new APIError(response.status, error)
    }
    
    return response.json()
  }
}

// 导出单例
export const apiClient = new APIClient()

// 导出API方法
export const api = {
  // 认证相关
  auth: {
    login: (email: string, password: string) =>
      apiClient.post('/auth/login', { email, password }),
    register: (email: string, password: string, username?: string) =>
      apiClient.post('/auth/register', { email, password, username }),
    logout: () => apiClient.post('/auth/logout'),
    me: () => apiClient.get('/auth/me'),
    changePassword: (current_password: string, new_password: string) =>
      apiClient.post('/auth/change-password', { current_password, new_password }),
  },
  
  // 视频相关
  videos: {
    parse: (url: string, platform?: string) =>
      apiClient.post('/videos/parse', { url, platform }),
    compress: (input_url: string, quality: string, target_size_mb?: number) =>
      apiClient.post('/videos/compress', { input_url, quality, target_size_mb }),
    convert: (input_url: string, target_format: string) =>
      apiClient.post('/videos/convert', { input_url, target_format }),
    crop: (input_url: string, aspect_ratio: string) =>
      apiClient.post('/videos/crop', { input_url, aspect_ratio }),
    merge: (video_urls: string[]) =>
      apiClient.post('/videos/merge', { video_urls }),
    getTasks: (params?: { status?: string; task_type?: string; limit?: number; offset?: number }) =>
      apiClient.get('/videos/tasks', params),
    getTaskDetail: (taskId: string) =>
      apiClient.get(`/videos/tasks/${taskId}`),
    deleteTask: (taskId: string) =>
      apiClient.delete(`/videos/tasks/${taskId}`),
  },
  
  // 音频相关
  audio: {
    upload: (file: File) =>
      apiClient.upload('/audio/upload', file),
    transcribe: (audio_url: string, language?: string) =>
      apiClient.post('/audio/transcribe', { audio_url, language }),
    translate: (audio_url: string, source_language: string, target_language: string) =>
      apiClient.post('/audio/translate', { audio_url, source_language, target_language }),
    convert: (audio_url: string, target_format: string) =>
      apiClient.post('/audio/convert', { audio_url, target_format }),
    getTasks: () =>
      apiClient.get('/audio/tasks'),
    getTaskDetail: (taskId: string) =>
      apiClient.get(`/audio/tasks/${taskId}`),
    getTranscription: (taskId: string) =>
      apiClient.get(`/audio/tasks/${taskId}/transcription`),
  },
  
  // 文档相关
  documents: {
    create: (title: string, content: string, tags?: string[], is_public?: boolean) =>
      apiClient.post('/documents/', { title, content, tags, is_public }),
    list: () =>
      apiClient.get('/documents/'),
    get: (documentId: string) =>
      apiClient.get(`/documents/${documentId}`),
    update: (documentId: string, data: any) =>
      apiClient.put(`/documents/${documentId}`, data),
    delete: (documentId: string) =>
      apiClient.delete(`/documents/${documentId}`),
    correctText: (text: string, language: string) =>
      apiClient.post('/documents/correct-text', { text, language }),
    summarize: (text: string, max_length?: number) =>
      apiClient.post('/documents/summarize', { text, max_length }),
  },
  
  // 博客相关
  blog: {
    list: (params?: { page?: number; size?: number; category?: string; tag?: string }) =>
      apiClient.get('/blog/', params),
    getBySlug: (slug: string) =>
      apiClient.get(`/blog/slug/${slug}`),
    search: (q: string) =>
      apiClient.get('/blog/search', { q }),
    getPopular: (limit?: number) =>
      apiClient.get('/blog/popular', { limit }),
    getRelated: (postId: string) =>
      apiClient.get(`/blog/related/${postId}`),
  },
}