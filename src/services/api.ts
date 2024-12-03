import axios, { AxiosError } from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  retry: 3,
  retryDelay: 1000,
})

api.interceptors.request.use(
  config => {
    const timestamp = new Date().getTime()
    config.url = config.url + (config.url?.includes('?') ? '&' : '?') + `_t=${timestamp}`
    
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated')
    if (isAuthenticated) {
      config.headers['Authorization'] = `Bearer ${isAuthenticated}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => response.data,
  async (error: AxiosError) => {
    const config = error.config

    if (!config || !config.retry) {
      return handleError(error)
    }

    config.retryCount = config.retryCount ?? 0

    if (config.retryCount >= config.retry) {
      return handleError(error)
    }

    config.retryCount += 1

    const backoff = new Promise(resolve => {
      setTimeout(() => {
        resolve(null)
      }, config.retryDelay || 1000)
    })

    await backoff
    return api(config)
  }
)

const handleError = (error: AxiosError) => {
  if (error.response) {
    if (error.response.status === 401) {
      localStorage.removeItem('isAdminAuthenticated')
      window.location.href = '/admin/login'
      return Promise.reject(new Error('Session expired. Please login again.'))
    }
    
    const message = error.response.data?.message || 'An error occurred with the server'
    console.error('Server Error:', message)
    return Promise.reject(new Error(message))
  } 
  
  if (error.request) {
    console.error('Network Error:', error.request)
    return Promise.reject(new Error('Unable to connect to the server. Please check your internet connection and try again.'))
  }
  
  console.error('Request Error:', error.message)
  return Promise.reject(new Error('An error occurred while making the request. Please try again.'))
}

export default api