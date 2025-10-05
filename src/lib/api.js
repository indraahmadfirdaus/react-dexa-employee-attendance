import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.otter-server.win/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const reqUrl = error.config?.url || ''
      const isLoginRequest = typeof reqUrl === 'string' && reqUrl.includes('/auth/login')
      const isOnLoginPage = typeof window !== 'undefined' && window.location?.pathname === '/login'

      if (isLoginRequest || isOnLoginPage) {
        return Promise.reject(error)
      }

      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)