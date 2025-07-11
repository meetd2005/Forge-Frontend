/**
 * 🔐 CLIENT-ONLY AUTH UTILITIES
 * These functions can be used in client components and do NOT use next/headers
 */

import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_CONFIG, parseAuthCookie, type DecodedToken, type AuthCookies, type AuthCookieOptions } from './shared'

// =====================================
// 🛠️ COOKIE HELPERS
// =====================================

/**
 * Set authentication cookie with secure defaults
 * Use this for login/signup and token renewal operations
 */
export function setAuthCookie(
  response: NextResponse,
  name: string,
  value: string,
  options: Partial<AuthCookieOptions> = {}
): void {
  const cookieOptions = {
    ...COOKIE_CONFIG,
    maxAge: name === COOKIE_CONFIG.ACCESS_TOKEN 
      ? COOKIE_CONFIG.ACCESS_TOKEN_MAX_AGE 
      : COOKIE_CONFIG.REFRESH_TOKEN_MAX_AGE,
    ...options,
  }

  response.cookies.set(name, value, cookieOptions)
}

/**
 * Clear authentication cookie
 * Use this for logout operations
 */
export function clearAuthCookie(
  response: NextResponse,
  name: string
): void {
  response.cookies.set(name, '', {
    ...COOKIE_CONFIG,
    maxAge: 0,
    expires: new Date(0),
  })
}

/**
 * Clear all authentication cookies
 * Use this for complete logout
 */
export function clearAllAuthCookies(response: NextResponse): void {
  clearAuthCookie(response, COOKIE_CONFIG.ACCESS_TOKEN)
  clearAuthCookie(response, COOKIE_CONFIG.REFRESH_TOKEN)
}

/**
 * Get authentication cookies from request (for middleware and API routes)
 */
export function getAuthCookies(request: NextRequest): AuthCookies {
  return {
    accessToken: request.cookies.get(COOKIE_CONFIG.ACCESS_TOKEN)?.value,
    refreshToken: request.cookies.get(COOKIE_CONFIG.REFRESH_TOKEN)?.value,
  }
}

/**
 * Check if user is authenticated based on cookies
 */
export function isAuthenticated(request: NextRequest): boolean {
  const { accessToken } = getAuthCookies(request)
  
  if (!accessToken) {
    return false
  }

  const decoded = parseAuthCookie(accessToken)
  return decoded !== null && decoded.type === 'access'
}

/**
 * Get current user from access token cookie
 */
export function getCurrentUser(request: NextRequest): DecodedToken | null {
  const { accessToken } = getAuthCookies(request)
  
  if (!accessToken) {
    return null
  }

  const decoded = parseAuthCookie(accessToken)
  return decoded && decoded.type === 'access' ? decoded : null
}

/**
 * Get authentication cookies from document.cookie (client-side only)
 * Use this in client components when you need to read cookies
 */
export function getClientAuthCookies(): AuthCookies {
  if (typeof document === 'undefined') {
    return { accessToken: undefined, refreshToken: undefined }
  }

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  return {
    accessToken: cookies[COOKIE_CONFIG.ACCESS_TOKEN],
    refreshToken: cookies[COOKIE_CONFIG.REFRESH_TOKEN],
  }
}

/**
 * Get current user from client-side cookies
 * Use this in client components instead of getServerCurrentUser
 */
export function getClientCurrentUser(): DecodedToken | null {
  const { accessToken } = getClientAuthCookies()
  
  if (!accessToken) {
    return null
  }

  const decoded = parseAuthCookie(accessToken)
  return decoded && decoded.type === 'access' ? decoded : null
}

/**
 * Check if user is authenticated on client-side
 * Use this in client components instead of isServerAuthenticated
 */
export function isClientAuthenticated(): boolean {
  const { accessToken } = getClientAuthCookies()
  
  if (!accessToken) {
    return false
  }

  const decoded = parseAuthCookie(accessToken)
  return decoded !== null && decoded.type === 'access'
}

// =====================================
// 🔒 MIDDLEWARE UTILITIES
// =====================================

/**
 * Create response with user info injected into headers
 * Use this in middleware to pass user data to API routes
 */
export function injectUserHeaders(
  response: NextResponse,
  user: DecodedToken
): NextResponse {
  // Inject user info into headers for backend services
  response.headers.set('X-User-ID', user.sub)
  response.headers.set('X-User-Email', user.email || '')
  response.headers.set('X-User-Name', user.name || '')
  response.headers.set('X-Auth-Type', user.type)
  
  return response
}

/**
 * Create unauthorized response
 */
export function createUnauthorizedResponse(
  request: NextRequest,
  redirectTo: string = '/login'
): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = redirectTo
  url.searchParams.set('from', request.nextUrl.pathname)
  
  return NextResponse.redirect(url)
}
