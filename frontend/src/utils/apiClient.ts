import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { getSession } from 'next-auth/react'

/**
 * Token cache to optimize authentication by avoiding redundant getSession() calls.
 * 
 * Previously, every API request called getSession() which hit /api/auth/session endpoint.
 * Now tokens are cached for 2.5 hours and only refreshed when:
 * - Cache expires (2.5 hours - before 3h token expiry)
 * - 401 error occurs (automatic retry with fresh token)
 * - User logs in/out (manual cache clear/refresh)
 * 
 * This dramatically reduces unnecessary session API calls while maintaining security.
 */
class TokenCache {
  private token: string | null = null
  private tokenExpiry: number = 0
  private refreshPromise: Promise<string | null> | null = null
  
  // Cache token for 2.5 hours (access tokens valid for 3 hours, refresh before expiry)
  // This means only 1 session check every 2.5 hours instead of every request!
  private readonly CACHE_DURATION = 150 * 60 * 1000 // 2.5 hours in milliseconds
  
  async getToken(): Promise<string | null> {
    const now = Date.now()
    
    // Return cached token if still valid
    if (this.token && now < this.tokenExpiry) {
      return this.token
    }
    
    // If already refreshing, wait for that promise
    if (this.refreshPromise) {
      return this.refreshPromise
    }
    
    // Refresh token
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
  
  // Force immediate token refresh (useful after login/logout)
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
    
    // If 401 and haven't retried yet, force token refresh and retry
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

// Export cache control functions for use in auth flows
export const refreshAuthToken = () => tokenCache.forceRefresh()
export const clearAuthToken = () => tokenCache.clearCache()

export default apiClient
