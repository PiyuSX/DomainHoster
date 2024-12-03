import { useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export interface BlogPost {
  _id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  image: string
}

export interface PortfolioItem {
  _id: string
  title: string
  description: string
  category: string
  image: string
  link: string
  github?: string
}

const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    _id: '1',
    title: 'Getting Started with Web Development',
    excerpt: 'Learn the basics of web development and start your journey.',
    content: 'Web development is an exciting field...',
    category: 'Web Development',
    author: 'John Doe',
    date: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
  }
]

const SAMPLE_PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    _id: '1',
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce solution',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c',
    link: 'https://example.com',
    github: 'https://github.com/example/project'
  }
]

// Max number of retries for API calls
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const retryOperation = async <T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> => {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0) {
      await sleep(delay)
      return retryOperation(operation, retries - 1, delay * 2)
    }
    throw error
  }
}

export const useInitializeDatabase = () => {
  useEffect(() => {
    initializeLocalStorage()
    fetchInitialData()
    
    const interval = setInterval(() => {
      checkForUpdates()
    }, 30000)

    return () => clearInterval(interval)
  }, [])
}

const initializeLocalStorage = () => {
  if (!localStorage.getItem('blogPosts')) {
    localStorage.setItem('blogPosts', JSON.stringify(SAMPLE_BLOG_POSTS))
  }
  if (!localStorage.getItem('portfolioItems')) {
    localStorage.setItem('portfolioItems', JSON.stringify(SAMPLE_PORTFOLIO_ITEMS))
  }
}

const fetchInitialData = async () => {
  try {
    const [blogPosts, portfolioItems] = await Promise.all([
      retryOperation(() => axios.get(`${API_URL}/blog`).then(res => res.data)),
      retryOperation(() => axios.get(`${API_URL}/portfolio`).then(res => res.data))
    ])

    localStorage.setItem('blogPosts', JSON.stringify(blogPosts))
    localStorage.setItem('portfolioItems', JSON.stringify(portfolioItems))
    localStorage.setItem('lastDataSync', Date.now().toString())
  } catch (error) {
    console.warn('Using cached data due to API error:', error)
  }
}

const checkForUpdates = async () => {
  try {
    const [blogPosts, portfolioItems] = await Promise.all([
      retryOperation(() => axios.get(`${API_URL}/blog`).then(res => res.data)),
      retryOperation(() => axios.get(`${API_URL}/portfolio`).then(res => res.data))
    ])

    localStorage.setItem('blogPosts', JSON.stringify(blogPosts))
    localStorage.setItem('portfolioItems', JSON.stringify(portfolioItems))
    localStorage.setItem('lastDataSync', Date.now().toString())

    window.dispatchEvent(new CustomEvent('dataUpdate'))
  } catch (error) {
    console.warn('Update check failed, using cached data:', error)
  }
}

const isNetworkError = (error: unknown): boolean => {
  return axios.isAxiosError(error) && !error.response && !window.navigator.onLine
}

const getErrorMessage = (error: unknown): string => {
  if (isNetworkError(error)) {
    return 'Network error: Unable to connect to the server. The app is running in offline mode.'
  }
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Unable to reach the server. Please check your internet connection.'
    }
    const status = error.response.status
    if (status === 404) {
      return 'The requested resource was not found.'
    }
    return error.response.data?.message || 'An unexpected error occurred.'
  }
  return error instanceof Error ? error.message : 'An unknown error occurred'
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await retryOperation(() => axios.get(`${API_URL}/blog`))
    const posts = response.data
    localStorage.setItem('blogPosts', JSON.stringify(posts))
    return posts
  } catch (error) {
    console.warn('Falling back to cached blog posts:', getErrorMessage(error))
    const cached = localStorage.getItem('blogPosts')
    if (cached) {
      return JSON.parse(cached)
    }
    return SAMPLE_BLOG_POSTS
  }
}

export const createBlogPost = async (post: Omit<BlogPost, '_id'>): Promise<BlogPost> => {
  try {
    const response = await retryOperation(() => axios.post(`${API_URL}/blog`, post))
    const newPost = response.data
    
    // Update local cache
    const cached = localStorage.getItem('blogPosts')
    const posts = cached ? JSON.parse(cached) : []
    posts.unshift(newPost)
    localStorage.setItem('blogPosts', JSON.stringify(posts))
    
    return newPost
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const updateBlogPost = async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
  try {
    const response = await retryOperation(() => axios.put(`${API_URL}/blog/${id}`, post))
    const updatedPost = response.data
    
    // Update local cache
    const cached = localStorage.getItem('blogPosts')
    if (cached) {
      const posts = JSON.parse(cached)
      const index = posts.findIndex((p: BlogPost) => p._id === id)
      if (index !== -1) {
        posts[index] = updatedPost
        localStorage.setItem('blogPosts', JSON.stringify(posts))
      }
    }
    
    return updatedPost
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    await retryOperation(() => axios.delete(`${API_URL}/blog/${id}`))
    
    // Update local cache
    const cached = localStorage.getItem('blogPosts')
    if (cached) {
      const posts = JSON.parse(cached)
      const filtered = posts.filter((p: BlogPost) => p._id !== id)
      localStorage.setItem('blogPosts', JSON.stringify(filtered))
    }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const getBlogPost = async (id: string): Promise<BlogPost> => {
  try {
    const response = await retryOperation(() => axios.get(`${API_URL}/blog/${id}`))
    return response.data
  } catch (error) {
    console.warn('Falling back to cached blog post')
    const cached = localStorage.getItem('blogPosts')
    if (cached) {
      const posts = JSON.parse(cached)
      const post = posts.find((p: BlogPost) => p._id === id)
      if (post) return post
    }
    throw new Error(getErrorMessage(error))
  }
}

export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  try {
    const response = await retryOperation(() => axios.get(`${API_URL}/portfolio`))
    const items = response.data
    localStorage.setItem('portfolioItems', JSON.stringify(items))
    return items
  } catch (error) {
    console.warn('Falling back to cached portfolio items:', getErrorMessage(error))
    const cached = localStorage.getItem('portfolioItems')
    if (cached) {
      return JSON.parse(cached)
    }
    return SAMPLE_PORTFOLIO_ITEMS
  }
}

export const createPortfolioItem = async (item: Omit<PortfolioItem, '_id'>): Promise<PortfolioItem> => {
  try {
    const response = await retryOperation(() => axios.post(`${API_URL}/portfolio`, item))
    const newItem = response.data
    
    // Update local cache
    const cached = localStorage.getItem('portfolioItems')
    const items = cached ? JSON.parse(cached) : []
    items.unshift(newItem)
    localStorage.setItem('portfolioItems', JSON.stringify(items))
    
    return newItem
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const updatePortfolioItem = async (id: string, item: Partial<PortfolioItem>): Promise<PortfolioItem> => {
  try {
    const response = await retryOperation(() => axios.put(`${API_URL}/portfolio/${id}`, item))
    const updatedItem = response.data
    
    // Update local cache
    const cached = localStorage.getItem('portfolioItems')
    if (cached) {
      const items = JSON.parse(cached)
      const index = items.findIndex((i: PortfolioItem) => i._id === id)
      if (index !== -1) {
        items[index] = updatedItem
        localStorage.setItem('portfolioItems', JSON.stringify(items))
      }
    }
    
    return updatedItem
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const deletePortfolioItem = async (id: string): Promise<void> => {
  try {
    await retryOperation(() => axios.delete(`${API_URL}/portfolio/${id}`))
    
    // Update local cache
    const cached = localStorage.getItem('portfolioItems')
    if (cached) {
      const items = JSON.parse(cached)
      const filtered = items.filter((i: PortfolioItem) => i._id !== id)
      localStorage.setItem('portfolioItems', JSON.stringify(filtered))
    }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const getPortfolioItem = async (id: string): Promise<PortfolioItem> => {
  try {
    const response = await retryOperation(() => axios.get(`${API_URL}/portfolio/${id}`))
    return response.data
  } catch (error) {
    console.warn('Falling back to cached portfolio item')
    const cached = localStorage.getItem('portfolioItems')
    if (cached) {
      const items = JSON.parse(cached)
      const item = items.find((i: PortfolioItem) => i._id === id)
      if (item) return item
    }
    throw new Error(getErrorMessage(error))
  }
}