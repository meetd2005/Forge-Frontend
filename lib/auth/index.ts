/**
 * 🔐 FORGE AUTH LIBRARY
 * Main entry point that re-exports auth utilities for different contexts
 */

// Re-export shared utilities and types
export * from './shared'

// Re-export client utilities (for client components and browser environments)
export * from './client'

// Re-export server utilities (for server components, API routes, and middleware)
export * from './server'

// =====================================
// � DOCUMENTATION
// =====================================

/**
 * USAGE GUIDE:
 * 
 * For Client Components (use client"):
 * - import { getClientCurrentUser, isClientAuthenticated, COOKIE_CONFIG } from "@/lib/auth"
 * - These functions read from document.cookie and don't use next/headers
 * 
 * For Server Components, API Routes, and Middleware:
 * - import { getServerCurrentUser, isServerAuthenticated, getAuthCookies } from "@/lib/auth"
 * - These functions use next/headers and NextRequest/NextResponse
 * 
 * For Shared Logic:
 * - import { parseAuthCookie, shouldRefreshToken, COOKIE_CONFIG } from "@/lib/auth"
 * - These functions work in both client and server contexts
 * 
 * Example Usage:
 * 
 * // In a client component
 * "use client"
 * import { getClientCurrentUser, COOKIE_CONFIG } from "@/lib/auth"
 * 
 * function MyComponent() {
 *   const user = getClientCurrentUser()
 *   // ...
 * }
 * 
 * // In a server component
 * import { getServerCurrentUser } from "@/lib/auth"
 * 
 * function MyServerComponent() {
 *   const user = getServerCurrentUser()
 *   // ...
 * }
 * 
 * // In middleware
 * import { getCurrentUser, isAuthenticated } from "@/lib/auth"
 * 
 * export function middleware(request: NextRequest) {
 *   if (isAuthenticated(request)) {
 *     const user = getCurrentUser(request)
 *     // ...
 *   }
 * }
 */
