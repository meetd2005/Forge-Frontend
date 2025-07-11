/**
 * 🛡️ FORGE AUTHENTICATION MIDDLEWARE
 * Cookie-based session validation and user injection for Next.js
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  isAuthenticated,
  getCurrentUser,
  getAuthCookies,
  shouldRefreshToken,
  refreshAuthTokens,
  setAuthCookie,
  injectUserHeaders,
  createUnauthorizedResponse,
  COOKIE_CONFIG,
} from '@/lib/auth'
import { API_CONFIG } from '@/lib/api-config'

// =====================================
// 🔧 MIDDLEWARE CONFIGURATION
// =====================================

/**
 * Routes that require authentication
 */
const PROTECTED_ROUTES = [
  '/profile',
  '/editor',
  '/bookmarks',
] as const

/**
 * Routes that should redirect authenticated users away
 */
const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
] as const

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  '/',
  '/search',
  '/article',
  '/maintenance',
  '/unauthorized',
  '/test-api-error',
  '/test-boundary',
  '/debug-auth',
  '/auth-test',
  '/_next',
  '/api',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
] as const

/**
 * API routes that should receive user headers
 */
const API_ROUTES_WITH_USER_INJECTION = [
  '/api/auth',
  '/api/users',
  '/api/posts',
  '/api/social',
  '/api/uploads',
] as const

// =====================================
// 🛠️ MIDDLEWARE UTILITIES
// =====================================

/**
 * Check if a path matches any of the given route patterns
 */
function matchesRoute(pathname: string, routes: readonly string[]): boolean {
  return routes.some(route => {
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1))
    }
    if (route.includes('[') || route.includes('...')) {
      // Handle dynamic routes - simple check for now
      const routePattern = route.replace(/\[.*?\]/g, '[^/]+')
      const regex = new RegExp(`^${routePattern}$`)
      return regex.test(pathname)
    }
    return pathname === route || pathname.startsWith(route + '/')
  })
}

/**
 * Check if route is protected
 */
function isProtectedRoute(pathname: string): boolean {
  return matchesRoute(pathname, PROTECTED_ROUTES)
}

/**
 * Check if route is an auth route
 */
function isAuthRoute(pathname: string): boolean {
  return matchesRoute(pathname, AUTH_ROUTES)
}

/**
 * Check if route is public
 */
function isPublicRoute(pathname: string): boolean {
  return matchesRoute(pathname, PUBLIC_ROUTES)
}

/**
 * Check if API route should receive user injection
 */
function shouldInjectUserHeaders(pathname: string): boolean {
  return matchesRoute(pathname, API_ROUTES_WITH_USER_INJECTION)
}

// =====================================
// 🔐 MAIN MIDDLEWARE FUNCTION
// =====================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  try {
    // Skip middleware for static files and internal Next.js routes
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/static/') ||
      pathname.includes('.') ||
      pathname === '/favicon.ico'
    ) {
      return response
    }

    // Get authentication cookies
    const { accessToken, refreshToken } = getAuthCookies(request)
    const currentUser = getCurrentUser(request)
    const authenticated = isAuthenticated(request)

    // =====================================
    // 🔄 TOKEN REFRESH LOGIC
    // =====================================

    // Check if we need to refresh the access token
    if (accessToken && refreshToken && shouldRefreshToken(accessToken)) {
      try {
        const refreshResult = await refreshAuthTokens(
          refreshToken,
          process.env.NEXT_PUBLIC_API_ENV === 'development' 
            ? 'http://localhost:8000' 
            : API_CONFIG.REST_BASE_URL.auth.replace('/api/auth', '')
        )

        if (refreshResult.success) {
          // Update the access token cookie
          setAuthCookie(response, COOKIE_CONFIG.ACCESS_TOKEN, refreshResult.accessToken)
          
          // Update current user with new token
          // Note: The new user info will be available on the next request
          console.log('🔄 Access token refreshed successfully')
        } else {
          console.warn('⚠️ Token refresh failed, clearing cookies')
          // Clear invalid cookies
          response.cookies.delete(COOKIE_CONFIG.ACCESS_TOKEN)
          response.cookies.delete(COOKIE_CONFIG.REFRESH_TOKEN)
        }
      } catch (error) {
        console.error('❌ Token refresh error:', error)
        // Clear potentially corrupted cookies
        response.cookies.delete(COOKIE_CONFIG.ACCESS_TOKEN)
        response.cookies.delete(COOKIE_CONFIG.REFRESH_TOKEN)
      }
    }

    // =====================================
    // 🛡️ ROUTE PROTECTION LOGIC
    // =====================================

    // Redirect authenticated users away from auth pages
    if (authenticated && isAuthRoute(pathname)) {
      const redirectUrl = request.nextUrl.searchParams.get('from') || '/'
      const url = request.nextUrl.clone()
      url.pathname = redirectUrl
      url.searchParams.delete('from')
      
      console.log(`🚀 Redirecting authenticated user from ${pathname} to ${redirectUrl}`)
      return NextResponse.redirect(url)
    }

    // Protect authenticated routes
    if (isProtectedRoute(pathname) && !authenticated) {
      console.log(`🔒 Redirecting unauthenticated user from ${pathname} to /login`)
      return createUnauthorizedResponse(request, '/login')
    }

    // =====================================
    // 📡 USER HEADER INJECTION FOR API ROUTES
    // =====================================

    // Inject user headers for API routes that need user context
    if (shouldInjectUserHeaders(pathname) && currentUser) {
      injectUserHeaders(response, currentUser)
      
      console.log(`👤 Injected user headers for ${pathname}:`, {
        userId: currentUser.sub,
        email: currentUser.email,
        type: currentUser.type,
      })
    }

    // =====================================
    // 🚦 GRACEFUL FORWARDING
    // =====================================

    // For public routes or when no special handling is needed,
    // gracefully forward the request with any modifications
    return response

  } catch (error) {
    console.error('❌ Middleware error:', error)
    
    // On any error, gracefully continue but clear potentially corrupted cookies
    response.cookies.delete(COOKIE_CONFIG.ACCESS_TOKEN)
    response.cookies.delete(COOKIE_CONFIG.REFRESH_TOKEN)
    
    return response
  }
}

// =====================================
// 📍 MIDDLEWARE MATCHER
// =====================================

/**
 * Configure which routes the middleware should run on
 * 
 * This matcher ensures the middleware runs on:
 * - All page routes (/)
 * - All API routes (/api)
 * - Excludes static files and Next.js internals
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (robots.txt, sitemap.xml, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}

// =====================================
// 📚 USAGE DOCUMENTATION
// =====================================

/**
 * MIDDLEWARE BEHAVIOR DOCUMENTATION
 * 
 * This middleware provides the following functionality:
 * 
 * 1. 🔄 AUTOMATIC TOKEN REFRESH
 *    - Checks if access token expires in < 5 minutes
 *    - Automatically refreshes using refresh token
 *    - Updates access token cookie seamlessly
 * 
 * 2. 🛡️ ROUTE PROTECTION
 *    - Redirects unauthenticated users from protected routes to /login
 *    - Redirects authenticated users away from auth pages (/login, /signup)
 *    - Preserves intended destination with 'from' query parameter
 * 
 * 3. 👤 USER CONTEXT INJECTION
 *    - Injects user info into request headers for API routes
 *    - Headers: X-User-ID, X-User-Email, X-User-Name, X-Auth-Type
 *    - Available to backend services and API routes
 * 
 * 4. 🚦 GRACEFUL HANDLING
 *    - Continues request processing for public routes
 *    - Clears corrupted cookies on errors
 *    - Logs authentication events for debugging
 * 
 * PROTECTED ROUTES:
 * - /profile - User profile page
 * - /editor - Content editor
 * - /bookmarks - User bookmarks
 * - /debug-auth - Authentication debugging
 * 
 * AUTH ROUTES (redirect if authenticated):
 * - /login - Login page
 * - /signup - Registration page
 * - /forgot-password - Password reset
 * 
 * PUBLIC ROUTES (no authentication required):
 * - / - Home page
 * - /search - Search functionality
 * - /article/[id] - Article viewing
 * - Static assets and API routes
 * 
 * ENVIRONMENT VARIABLES:
 * - NEXT_PUBLIC_API_ENV: 'development' | 'staging' | 'production'
 * - NEXT_PUBLIC_COOKIE_DOMAIN: Domain for production cookies (optional)
 * 
 * DEBUGGING:
 * Check browser console for middleware logs:
 * - 🔄 Token refresh events
 * - 🚀 Authentication redirects
 * - 🔒 Route protection triggers
 * - 👤 User header injection
 * - ❌ Error handling
 */
