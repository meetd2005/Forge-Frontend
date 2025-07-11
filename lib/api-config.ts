/**
 * 🚀 FORGE API CONFIGURATION
 * Type-safe endpoint management for seamless environment switching
 * CHUNK 1B: Complete API Configuration System
 */

// =====================================
// 🔧 TYPE DEFINITIONS
// =====================================

type Environment = 'development' | 'staging' | 'production'

interface RestEndpoints {
  auth: string
  users: string
  uploads: string
  social: string
  ai: string
  billing: string
  notifications: string
}

interface ApiEndpoints {
  rest: RestEndpoints
  graphql: string
  websocket: string
}

interface ApiEnvironment {
  name: string
  endpoints: ApiEndpoints
}

// =====================================
// 🌍 API ENDPOINTS BY ENVIRONMENT
// =====================================

// Dynamic development host detection
const getDevHost = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    console.log('🌐 Frontend hostname detected:', hostname)
    
    // Use the same hostname (localhost or 127.0.0.1) that the frontend is using
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.log('🔧 Using backend hostname:', hostname)
      return hostname
    }
  }
  // Default fallback for SSR or when window is not available
  // Use 127.0.0.1 for consistent cookie domain handling
  console.log('🔧 Using fallback backend hostname: 127.0.0.1')
  return '127.0.0.1'
}

const API_ENVIRONMENTS: Record<Environment, ApiEnvironment> = {
  development: {
    name: 'Development',
    endpoints: {
      rest: {
        auth: `http://${getDevHost()}:8000/api/auth`,
        users: `http://${getDevHost()}:8000/api/users`,
        uploads: `http://${getDevHost()}:8000/api/uploads`,
        social: `http://${getDevHost()}:8000/api/social`,
        ai: `http://${getDevHost()}:8000/api/ai`,
        billing: `http://${getDevHost()}:8000/api/billing`,
        notifications: `http://${getDevHost()}:8000/api/notifications`
      },
      graphql: `http://${getDevHost()}:8000/graphql`,
      websocket: `ws://${getDevHost()}:8000/ws`
    }
  },
  staging: {
    name: 'Staging',
    endpoints: {
      rest: {
        auth: 'https://forge-backend-staging.koyeb.app/api/auth',
        users: 'https://forge-backend-staging.koyeb.app/api/users',
        uploads: 'https://forge-backend-staging.koyeb.app/api/uploads',
        social: 'https://forge-backend-staging.koyeb.app/api/social',
        ai: 'https://forge-backend-staging.koyeb.app/api/ai',
        billing: 'https://forge-backend-staging.koyeb.app/api/billing',
        notifications: 'https://forge-backend-staging.koyeb.app/api/notifications'
      },
      graphql: 'https://forge-backend-staging.koyeb.app/graphql',
      websocket: 'wss://forge-backend-staging.koyeb.app/ws'
    }
  },
  production: {
    name: 'Production',
    endpoints: {
      rest: {
        auth: 'https://forge-backend.koyeb.app/api/auth',
        users: 'https://forge-backend.koyeb.app/api/users',
        uploads: 'https://forge-backend.koyeb.app/api/uploads',
        social: 'https://forge-backend.koyeb.app/api/social',
        ai: 'https://forge-backend.koyeb.app/api/ai',
        billing: 'https://forge-backend.koyeb.app/api/billing',
        notifications: 'https://forge-backend.koyeb.app/api/notifications'
      },
      graphql: 'https://forge-backend.koyeb.app/graphql',
      websocket: 'wss://forge-backend.koyeb.app/ws'
    }
  }
}

// =====================================
// 🎯 CURRENT ENVIRONMENT DETECTION
// =====================================

const getCurrentEnvironment = (): Environment => {
  // Check for explicit environment override
  if (typeof window !== 'undefined' && window.localStorage) {
    const override = localStorage.getItem('forge_api_env') as Environment
    if (override && API_ENVIRONMENTS[override]) {
      console.log(`🔧 API Environment Override: ${override}`)
      return override
    }
  }

  // Check for Next.js environment variable override
  const envOverride = process.env.NEXT_PUBLIC_API_ENV as Environment
  if (envOverride && API_ENVIRONMENTS[envOverride]) {
    return envOverride
  }

  // Auto-detect based on hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development'
    }
    
    if (hostname.includes('staging') || hostname.includes('preview')) {
      return 'staging'
    }
  }

  // Default to production for GitHub Pages or custom domains
  return 'production'
}

// =====================================
// 📡 EXPORTED API CONFIGURATION
// =====================================

const CURRENT_ENV = getCurrentEnvironment()
const CURRENT_API = API_ENVIRONMENTS[CURRENT_ENV]

export const API_CONFIG = {
  // Current environment
  ENVIRONMENT: CURRENT_ENV,
  
  // API Endpoints
  REST_BASE_URL: CURRENT_API.endpoints.rest,
  GRAPHQL_ENDPOINT: CURRENT_API.endpoints.graphql,
  WEBSOCKET_ENDPOINT: CURRENT_API.endpoints.websocket,
  
  // Specific REST endpoints
  AUTH: {
    LOGIN: `${CURRENT_API.endpoints.rest.auth}/login`,
    REGISTER: `${CURRENT_API.endpoints.rest.auth}/register`,
    REFRESH: `${CURRENT_API.endpoints.rest.auth}/refresh`,
    LOGOUT: `${CURRENT_API.endpoints.rest.auth}/logout`,
    LOGOUT_ALL: `${CURRENT_API.endpoints.rest.auth}/logout-all`,
    FORGOT_PASSWORD: `${CURRENT_API.endpoints.rest.auth}/forgot-password`,
    RESET_PASSWORD: `${CURRENT_API.endpoints.rest.auth}/reset-password`,
    CHANGE_PASSWORD: `${CURRENT_API.endpoints.rest.auth}/change-password`,
    VERIFY_EMAIL: `${CURRENT_API.endpoints.rest.auth}/verify-email`,
    RESEND_VERIFICATION: `${CURRENT_API.endpoints.rest.auth}/resend-verification`,
    GOOGLE_OAUTH: `${CURRENT_API.endpoints.rest.auth}/google`,
    GOOGLE_CALLBACK: `${CURRENT_API.endpoints.rest.auth}/google/callback`,
    OAUTH_COMPLETE: `${CURRENT_API.endpoints.rest.auth}/oauth/complete`,
    SESSIONS: `${CURRENT_API.endpoints.rest.auth}/sessions`,
    REVOKE_SESSION: `${CURRENT_API.endpoints.rest.auth}/sessions/revoke`,
  },
  
  USERS: {
    ME: `${CURRENT_API.endpoints.rest.users}/me`,
    PREFERENCES: `${CURRENT_API.endpoints.rest.users}/me/preferences`,
    PROFILE: (userId: string) => `${CURRENT_API.endpoints.rest.users}/${userId}`,
    AVATAR: `${CURRENT_API.endpoints.rest.users}/avatar`,
  },
  
  UPLOADS: {
    IMAGE: `${CURRENT_API.endpoints.rest.uploads}/image`,
    AVATAR: `${CURRENT_API.endpoints.rest.uploads}/avatar`,
    INFO: `${CURRENT_API.endpoints.rest.uploads}/info`,
    DELETE: (imageId: string) => `${CURRENT_API.endpoints.rest.uploads}/${imageId}`,
  },
  
  SOCIAL: {
    LIKE: (postId: string) => `${CURRENT_API.endpoints.rest.social}/posts/${postId}/like`,
    BOOKMARK: (postId: string) => `${CURRENT_API.endpoints.rest.social}/posts/${postId}/bookmark`,
    FOLLOW: (userId: string) => `${CURRENT_API.endpoints.rest.social}/users/${userId}/follow`,
    BOOKMARKS: `${CURRENT_API.endpoints.rest.social}/bookmarks`,
  },
  
  TAGS: {
    LIST: `${CURRENT_API.endpoints.rest.social}/tags`,
    TRENDING: `${CURRENT_API.endpoints.rest.social}/tags/trending`,
    BY_SLUG: (slug: string) => `${CURRENT_API.endpoints.rest.social}/tags/${slug}/posts`,
    CREATE: `${CURRENT_API.endpoints.rest.social}/tags`,
  },
  
  AI: {
    GENERATE_TEXT: `${CURRENT_API.endpoints.rest.ai}/generate-text`,
    GENERATE_IMAGE: `${CURRENT_API.endpoints.rest.ai}/generate-image`,
    IMPROVE_CONTENT: `${CURRENT_API.endpoints.rest.ai}/improve-content`,
  },
  
  BILLING: {
    CREATE_CHECKOUT: `${CURRENT_API.endpoints.rest.billing}/create-checkout`,
    WEBHOOK: `${CURRENT_API.endpoints.rest.billing}/webhook`,
    SUBSCRIPTION: `${CURRENT_API.endpoints.rest.billing}/subscription`,
  },
  
  NOTIFICATIONS: {
    SUBSCRIBE: `${CURRENT_API.endpoints.rest.notifications}/subscribe`,
    PREFERENCES: `${CURRENT_API.endpoints.rest.notifications}/preferences`,
  },
  
  // WebSocket endpoints
  WEBSOCKET: {
    POST_UPDATES: (postId: string) => `${CURRENT_API.endpoints.websocket}/posts/${postId}`,
    USER_NOTIFICATIONS: (userId: string) => `${CURRENT_API.endpoints.websocket}/users/${userId}/notifications`,
    GLOBAL_FEED: `${CURRENT_API.endpoints.websocket}/feed`,
  }
} as const

// =====================================
// 🚀 MODERN API HELPERS (New in CHUNK 1B)
// =====================================

/**
 * Type-safe REST API helper with automatic authentication
 */
export const restAPI = {
  auth: CURRENT_API.endpoints.rest.auth,
  users: CURRENT_API.endpoints.rest.users,
  uploads: CURRENT_API.endpoints.rest.uploads,
  social: CURRENT_API.endpoints.rest.social,
  ai: CURRENT_API.endpoints.rest.ai,
  billing: CURRENT_API.endpoints.rest.billing,
  notifications: CURRENT_API.endpoints.rest.notifications
}

/**
 * GraphQL endpoint with authentication helper
 */
export const getGraphQLConfig = (token?: string) => ({
  uri: CURRENT_API.endpoints.graphql,
  headers: {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
})

/**
 * WebSocket connection helper
 */
export const connectWebSocket = (path: string) => {
  const wsUrl = `${CURRENT_API.endpoints.websocket}${path}`
  return new WebSocket(wsUrl)
}

/**
 * Get auth headers for API requests
 */
export const getAuthHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })
})

/**
 * Get headers for multipart/form-data requests
 */
export const getMultipartHeaders = (token?: string) => ({
  // Don't set Content-Type for multipart/form-data, let browser set it
  ...(token && { 'Authorization': `Bearer ${token}` })
})

/**
 * Current API environment info
 */
export const api = CURRENT_API
export const currentEnvironment = CURRENT_ENV

// =====================================
// 🛠️ UTILITY FUNCTIONS
// =====================================

/**
 * Override the API environment (useful for testing)
 */
export const setApiEnvironment = (env: Environment) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('forge_api_env', env)
    console.log(`🔧 API Environment set to: ${env}`)
    // Reload to apply changes
    window.location.reload()
  }
}

/**
 * Clear API environment override
 */
export const clearApiEnvironment = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('forge_api_env')
    console.log('🔧 API Environment override cleared')
    window.location.reload()
  }
}

/**
 * Get current API status
 */
export const getApiStatus = () => {
  return {
    environment: CURRENT_ENV,
    restUrl: CURRENT_API.endpoints.rest,
    graphqlUrl: CURRENT_API.endpoints.graphql,
    websocketUrl: CURRENT_API.endpoints.websocket,
    isLocal: CURRENT_ENV === 'development',
    isProduction: CURRENT_ENV === 'production'
  }
}

/**
 * Create authenticated headers for API requests
 */
export const createAuthHeaders = (includeContentType = true) => {
  const headers: Record<string, string> = {}
  
  // Add auth token if available
  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('forge_token')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }
  
  // Add content type for JSON requests
  if (includeContentType) {
    headers['Content-Type'] = 'application/json'
  }
  
  return headers
}

/**
 * Create form data headers (for file uploads)
 */
export const createFormHeaders = () => {
  const headers: Record<string, string> = {}
  
  // Add auth token if available (no Content-Type for FormData)
  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('forge_token')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }
  
  return headers
}

// =====================================
// 🔍 DEVELOPMENT UTILITIES
// =====================================

/**
 * Test connectivity to current API endpoints
 */
export const testApiConnectivity = async () => {
  const results = {
    environment: CURRENT_ENV,
    tests: {} as Record<string, { success: boolean; responseTime: number; error?: string }>
  }
  
  const testEndpoints = [
    { name: 'Auth Health', url: `${API_CONFIG.REST_BASE_URL.auth}/health` },
    { name: 'Users API', url: `${API_CONFIG.REST_BASE_URL.users}/health` },
    { name: 'GraphQL', url: API_CONFIG.GRAPHQL_ENDPOINT }
  ]
  
  for (const endpoint of testEndpoints) {
    const startTime = Date.now()
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(endpoint.url, {
        method: 'GET',
        signal: controller.signal,
        credentials: 'include'
      })
      
      clearTimeout(timeoutId)
      const responseTime = Date.now() - startTime
      
      results.tests[endpoint.name] = {
        success: response.ok,
        responseTime,
        error: response.ok ? undefined : `HTTP ${response.status}`
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      results.tests[endpoint.name] = {
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  return results
}

/**
 * Test both localhost and 127.0.0.1 endpoints (development only)
 */
export const testLocalEndpoints = async () => {
  if (CURRENT_ENV !== 'development') {
    throw new Error('Local endpoint testing is only available in development')
  }
  
  const testUrls = [
    'http://localhost:8000/api/auth',
    'http://127.0.0.1:8000/api/auth'
  ]
  
  const results = []
  
  for (const url of testUrls) {
    const startTime = Date.now()
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)
      
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        signal: controller.signal,
        credentials: 'include'
      })
      
      clearTimeout(timeoutId)
      const responseTime = Date.now() - startTime
      
      results.push({
        endpoint: url,
        hostname: new URL(url).hostname,
        success: response.ok,
        responseTime,
        status: response.status,
        error: response.ok ? undefined : `HTTP ${response.status}`
      })
    } catch (error) {
      const responseTime = Date.now() - startTime
      results.push({
        endpoint: url,
        hostname: new URL(url).hostname,
        success: false,
        responseTime,
        status: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  return {
    currentHost: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
    recommendedEndpoint: results.find(r => r.hostname === (typeof window !== 'undefined' ? window.location.hostname : 'localhost'))?.endpoint || testUrls[0],
    results
  }
}

/**
 * Debug API configuration
 */
export const debugApiConfig = () => {
  console.group('🔧 Forge API Configuration Debug')
  console.log('Environment:', CURRENT_ENV)
  console.log('Frontend Host:', typeof window !== 'undefined' ? window.location.hostname : 'SSR')
  console.log('Dynamic Dev Host:', getDevHost())
  console.log('Auth Endpoint:', API_CONFIG.AUTH.LOGIN)
  console.log('Users Endpoint:', API_CONFIG.USERS.ME)
  console.log('GraphQL Endpoint:', API_CONFIG.GRAPHQL_ENDPOINT)
  console.log('WebSocket Endpoint:', API_CONFIG.WEBSOCKET_ENDPOINT)
  
  if (typeof window !== 'undefined' && window.localStorage) {
    const override = localStorage.getItem('forge_api_env')
    if (override) {
      console.log('Environment Override:', override)
    }
  }
  
  console.groupEnd()
}


// =====================================
// 📝 USAGE EXAMPLES
// =====================================

/*
// ✅ Using REST endpoints
const response = await fetch(API_CONFIG.AUTH.LOGIN, {
  method: 'POST',
  headers: createAuthHeaders(),
  body: JSON.stringify({ email, password })
})

// ✅ Using GraphQL endpoint with Apollo Client
const client = new ApolloClient({
  uri: API_CONFIG.GRAPHQL_ENDPOINT,
  headers: createAuthHeaders(false)
})

// ✅ Using WebSocket
const ws = new WebSocket(API_CONFIG.WEBSOCKET.POST_UPDATES('post-123'))

// ✅ Environment switching (for testing)
setApiEnvironment('staging') // Switch to staging
clearApiEnvironment()       // Reset to auto-detect

// ✅ Check current status
console.log(getApiStatus())
*/

export default API_CONFIG
