/**
 * 🔐 SERVER-ONLY AUTH UTILITIES
 * These functions use next/headers and can only be used in server components and middleware
 */

import { cookies } from 'next/headers'
import { COOKIE_CONFIG, parseAuthCookie, type DecodedToken, type AuthCookies } from './shared'

/**
 * Get authentication cookies from server components (using next/headers)
 * Only use this in server components, API routes, or middleware
 */
export function getServerAuthCookies(): AuthCookies {
  const cookieStore = cookies()
  
  return {
    accessToken: cookieStore.get(COOKIE_CONFIG.ACCESS_TOKEN)?.value,
    refreshToken: cookieStore.get(COOKIE_CONFIG.REFRESH_TOKEN)?.value,
  }
}

/**
 * Get current user from server components
 * Only use this in server components, API routes, or middleware
 */
export function getServerCurrentUser(): DecodedToken | null {
  const { accessToken } = getServerAuthCookies()
  
  if (!accessToken) {
    return null
  }

  const decoded = parseAuthCookie(accessToken)
  return decoded && decoded.type === 'access' ? decoded : null
}

/**
 * Check if user is authenticated in server components
 * Only use this in server components, API routes, or middleware
 */
export function isServerAuthenticated(): boolean {
  const { accessToken } = getServerAuthCookies()
  
  if (!accessToken) {
    return false
  }

  const decoded = parseAuthCookie(accessToken)
  return decoded !== null && decoded.type === 'access'
}
