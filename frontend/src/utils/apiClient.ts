import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { getSession } from 'next-auth/react'

class TokenCache {
  private token: string | null = null
  private tokenExpiry: number = 0
  private refreshPromise: Promise<string | null> | null = null
  
  private readonly CACHE_DURATION = 150 * 60 * 1000
  
  async getToken(): Promise<string | null> {
    const now = Date.now()
    
    if (this.token && now < this.tokenExpiry) {
      return this.token
    }
    
    if (this.refreshPromise) {
      return this.refreshPromise
    }
    
    this.refreshPromise = this.refreshToken()
    
    try {
      const token = await this.refreshPromise
      return token
    } finally {
      this.refreshPromise = null
    }
  }
  
  private async refreshToken(): Promise<string | null> {
    try {
      const session = await getSession()
      
      if (session?.accessToken) {
        this.token = session.accessToken
        this.tokenExpiry = Date.now() + this.CACHE_DURATION
        return this.token
      }
      
      this.clearCache()
      return null
    } catch (error) {
      console.error('Failed to refresh token:', error)
      this.clearCache()
      return null
    }
  }
  
  clearCache(): void {
    this.token = null
    this.tokenExpiry = 0
  }
  
  async forceRefresh(): Promise<string | null> {
    this.clearCache()
    return this.getToken()
  }
}

const tokenCache = new TokenCache()

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await tokenCache.getToken()
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const newToken = await tokenCache.forceRefresh()
      
      if (newToken && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      }
    }
    
    if (error.response?.status === 401) {
      console.error('Unauthorized request - token may be expired')
      tokenCache.clearCache()
    }
    
    return Promise.reject(error)
  }
)

export const refreshAuthToken = () => tokenCache.forceRefresh()
export const clearAuthToken = () => tokenCache.clearCache()

export default apiClient
