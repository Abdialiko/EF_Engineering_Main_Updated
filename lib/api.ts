/**
 * API Configuration
 * Centralized API base URL and utility functions
 */

export const API_BASE_URL = 'https://api.efengineering-architect.com/api/'

/**
 * Get full API URL for an endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${API_BASE_URL}${cleanEndpoint}`
}

/**
 * Get image URL from API response
 * Handles various image path formats from the API
 */
export const getImageUrl = (item: any, fallback: string = '/images/hero/home.jpg'): string => {
  if (!item) return fallback

  // Handle photos array
  if (Array.isArray(item.photos) && item.photos.length > 0) {
    const first = item.photos[0]
    if (typeof first === 'string') {
      return first.startsWith('http') ? first : `${API_BASE_URL.replace('/api/', '')}${first}`
    }
    const path = first?.path || first?.url || first?.src
    if (path) {
      return path.startsWith('http') ? path : `${API_BASE_URL.replace('/api/', '')}${path}`
    }
  }

  // Handle single image fields
  const imagePath = item.image_url || item.image || item.photo || item.path
  if (imagePath) {
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/api/')) return `https://api.efengineering-architect.com${imagePath}`
    if (imagePath.startsWith('/')) return `https://api.efengineering-architect.com${imagePath}`
    return `${API_BASE_URL.replace('/api/', '')}${imagePath}`
  }

  return fallback
}

// Cache for API responses (client-side only)
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch data from API with error handling, retry logic, timeout, and caching
 */
export const fetchApi = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0,
  useCache = true
): Promise<T> => {
  const MAX_RETRIES = 2
  const RETRY_DELAY = 1000 // 1 second
  const TIMEOUT = 10000 // 10 seconds

  const url = getApiUrl(endpoint)
  const cacheKey = `${url}_${JSON.stringify(options)}`

  // Check cache first (client-side only)
  if (typeof window !== 'undefined' && useCache && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!
    const now = Date.now()
    if (now - cached.timestamp < CACHE_DURATION) {
      return cached.data as T
    }
    cache.delete(cacheKey)
  }

  let timeoutId: NodeJS.Timeout | null = null
  
  try {
    const controller = new AbortController()
    timeoutId = setTimeout(() => {
      controller.abort()
    }, TIMEOUT)

    // Use revalidate for better caching in Next.js
    const cacheOption = options.cache || (options.method === 'GET' ? 'force-cache' : 'no-store')
    const revalidate = options.method === 'GET' ? 300 : undefined // 5 minutes revalidation

    const response = await fetch(url, {
      ...options,
      cache: cacheOption,
      next: revalidate ? { revalidate } : undefined,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    })

    // Clear timeout if request completed successfully
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const result = (Array.isArray(data) ? data : data?.data || data) as T

    // Cache the result (client-side only)
    if (typeof window !== 'undefined' && useCache && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
      cache.set(cacheKey, { data: result, timestamp: Date.now() })
    }

    return result
  } catch (error: any) {
    // Clear timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    // Check if it's an abort error (timeout)
    const isAbortError = error.name === 'AbortError' || error.message === 'signal is aborted without reason'
    
    // Retry logic for network errors
    const isNetworkError = 
      isAbortError ||
      error.message === 'Failed to fetch' ||
      error.message.includes('timeout') ||
      error.message.includes('Network') ||
      !error.response

    if (retryCount < MAX_RETRIES && isNetworkError) {
      // Don't log abort errors as they're expected for timeouts
      if (!isAbortError) {
        console.log(`Retrying API call to ${endpoint} (attempt ${retryCount + 1}/${MAX_RETRIES})...`)
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)))
      return fetchApi<T>(endpoint, options, retryCount + 1, useCache)
    }

    // Only log non-abort errors
    if (!isAbortError) {
      console.error(`API call failed to ${endpoint}:`, error)
    }
    
    // For abort errors, throw a more user-friendly error
    if (isAbortError) {
      throw new Error(`Request timeout: The server took too long to respond`)
    }
    
    throw error
  }
}

/**
 * Clear API cache (useful for force refresh)
 */
export const clearApiCache = () => {
  cache.clear()
}

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Main resources
  SERVICES: 'services',
  PROJECTS: 'projects',
  NEWS: 'news',
  TEAMS: 'teams',
  CLIENTS: 'clients',
  GALLERIES: 'galleries',
  JOBS: 'jobs',
  CATEGORIES: 'categories',

  // Detail endpoints
  SERVICE: (id: string | number) => `services/${id}`,
  PROJECT: (id: string | number) => `projects/${id}`,
  NEWS_ITEM: (id: string | number) => `news/${id}`,
  TEAM_MEMBER: (id: string | number) => `teams/${id}`,
  JOB: (id: string | number) => `jobs/${id}`,
} as const

