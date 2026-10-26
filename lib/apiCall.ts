import axios from 'axios'

const apiCall = axios.create({
    baseURL:'https://api.efengineering-architect.com/api/',
    // baseURL:'http://192.168.0.10:8001/api/',
    // Set default Content-Type for JSON requests
    // For FormData, axios will automatically set Content-Type with boundary
    headers: { 
      "Content-Type": "application/json"
    },
    timeout: 120000,
    withCredentials: false, // Don't send credentials (helps with CORS)
})

// Override Content-Type for FormData requests
apiCall.interceptors.request.use(
  (config) => {
    // If data is FormData, remove Content-Type header to let axios set it with boundary
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      const headers = config.headers as { delete?: (name: string) => void } | undefined
      if (headers && typeof headers.delete === 'function') {
        headers.delete('Content-Type')
        headers.delete('content-type')
      } else if (config.headers) {
        delete config.headers['Content-Type']
        delete config.headers['content-type']
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add request interceptor for debugging (only in dev mode)
if (process.env.NODE_ENV === 'development') {
  apiCall.interceptors.request.use(
    (config) => {
      console.log('File upload request:', {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL,
        hasData: !!config.data,
        dataType: config.data instanceof FormData ? 'FormData' : typeof config.data
      })
      return config
    },
    (error) => {
      console.error('File upload request error:', error)
      return Promise.reject(error)
    }
  )

  // Add response interceptor for debugging
  apiCall.interceptors.response.use(
    (response) => {
      console.log('File upload response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      })
      return response
    },
    (error) => {
      // Safe error logging - log properties separately
      console.error('File upload response error occurred')
      console.error('Error message:', error?.message || 'No message')
      console.error('Error code:', error?.code || 'No code')
      
      if (error?.response) {
        console.error('Response status:', error.response.status)
        console.error('Response statusText:', error.response.statusText)
        console.error('Response headers:', error.response.headers)
        console.error('Content-Type:', error.response.headers?.['content-type'] || error.response.headers?.['Content-Type'])
        console.error('Response data type:', typeof error.response.data)
        
        // Check if response is HTML (server error page)
        const contentType = error.response.headers?.['content-type'] || error.response.headers?.['Content-Type'] || ''
        if (contentType.includes('text/html') || contentType.includes('text/plain')) {
          // Try to get raw response text
          if (error.response.request?.responseText) {
            const htmlText = error.response.request.responseText
            console.error('Response HTML (first 1000 chars):', htmlText.substring(0, 1000))
            
            // Extract error message from HTML
            const errorMatch = htmlText.match(/Error:([^<\n]+)/i) || htmlText.match(/Call to a member function[^<\n]+/i)
            if (errorMatch) {
              console.error('Extracted error:', errorMatch[0])
            }
          }
        }
        
        if (typeof error.response.data === 'string') {
          console.error('Response data (first 500 chars):', error.response.data.substring(0, 500))
        } else {
          console.error('Response data:', error.response.data)
          // If data is empty object, try to access request responseText
          if (Object.keys(error.response.data || {}).length === 0 && error.response.request?.responseText) {
            console.error('Raw response text (first 1000 chars):', error.response.request.responseText.substring(0, 1000))
          }
        }
      } else {
        console.error('No response object in error')
      }
      
      if (error?.request) {
        console.error('Request exists:', true)
      } else {
        console.error('No request object in error')
      }
      
      // Also log the full error object for inspection
      console.error('Full error object:', error)
      
      return Promise.reject(error)
    }
  )
}

export default apiCall

