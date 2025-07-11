/**
 * 🔐 SHARED AUTH UTILITIES
 * Common types, constants, and utilities that can be used in both client and server contexts
 */

import jwt from 'jsonwebtoken'

// =====================================
// 🍪 COOKIE CONFIGURATION
// =====================================

/**
 * Cookie attributes for cross-service interoperability
 * These values should be consistent across all microservices
 */
export const COOKIE_CONFIG = {
  // Cookie names
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  
  // Security attributes
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
  sameSite: 'lax' as const, // Cross-site protection while allowing normal navigation
  
  // Expiration times (in seconds)
  ACCESS_TOKEN_MAX_AGE: 15 * 60, // 15 minutes
  REFRESH_TOKEN_MAX_AGE: 7 * 24 * 60 * 60, // 7 days
  
  // Path
  path: '/',
  
  // Domain (set based on environment)
  domain: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_COOKIE_DOMAIN 
    : undefined,
} as const

// =====================================
// 📝 TYPE DEFINITIONS
// =====================================

export interface AuthCookieOptions {
  maxAge?: number
  expires?: Date
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  path?: string
  domain?: string
}

export interface DecodedToken {
  sub: string // User ID
  email?: string
  name?: string
  type: 'access' | 'refresh'
  exp: number
  iat: number
  jti: string // Token ID
}

export interface AuthCookies {
  accessToken?: string
  refreshToken?: string
}

// =====================================
// 🛠️ SHARED UTILITIES
// =====================================

/**
 * Parse authentication cookie and return decoded JWT
 * Returns null if cookie is invalid or expired
 */
export function parseAuthCookie(cookieValue: string): DecodedToken | null {
  try {
    // Note: We're not verifying the signature here since that should be done by the backend
    // This is just for extracting user info for client-side use
    const decoded = jwt.decode(cookieValue) as DecodedToken | null
    
    if (!decoded || typeof decoded !== 'object') {
      return null
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000)
    if (decoded.exp && decoded.exp < now) {
      return null
    }

    return decoded
  } catch (error) {
    console.warn('Failed to parse auth cookie:', error)
    return null
  }
}

/**
 * Check if access token needs refresh (expires in less than 5 minutes)
 */
export function shouldRefreshToken(accessToken: string): boolean {
  const decoded = parseAuthCookie(accessToken)
  if (!decoded) return true

  const now = Math.floor(Date.now() / 1000)
  const timeUntilExpiry = decoded.exp - now
  
  // Refresh if expires in less than 5 minutes
  return timeUntilExpiry < 5 * 60
}

/**
 * Attempt to refresh tokens using the refresh token
 */
export async function refreshAuthTokens(
  refreshToken: string,
  apiBaseUrl: string
): Promise<{ accessToken: string; success: boolean }> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Cookie': `${COOKIE_CONFIG.REFRESH_TOKEN}=${refreshToken}`,
      },
    })

    if (response.ok) {
      // Extract new access token from response cookies
      const setCookieHeader = response.headers.get('set-cookie')
      const accessTokenMatch = setCookieHeader?.match(
        new RegExp(`${COOKIE_CONFIG.ACCESS_TOKEN}=([^;]+)`)
      )
      
      if (accessTokenMatch) {
        return {
          accessToken: accessTokenMatch[1],
          success: true,
        }
      }
    }

    return { accessToken: '', success: false }
  } catch (error) {
    console.warn('Token refresh failed:', error)
    return { accessToken: '', success: false }
  }
}
