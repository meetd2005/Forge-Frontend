# 🍪 Forge Authentication Cookie Specification

This document defines the cookie-based authentication system for cross-service interoperability in the Forge platform.

## 📋 Table of Contents

- [Overview](#overview)
- [Cookie Configuration](#cookie-configuration)
- [Security Attributes](#security-attributes)
- [Token Format](#token-format)
- [Implementation Guide](#implementation-guide)
- [Cross-Service Integration](#cross-service-integration)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

## 🔍 Overview

The Forge platform uses HTTP-only cookies for secure session management. This approach provides:

- **Security**: Protection against XSS attacks via HTTP-only flag
- **Convenience**: Automatic inclusion in requests without client-side token management
- **Scalability**: Consistent format across all microservices
- **Performance**: Automatic token refresh without user intervention

## 🍪 Cookie Configuration

### Cookie Names

| Cookie Name | Purpose | Lifespan | Size Limit |
|-------------|---------|----------|------------|
| `access_token` | Short-lived authentication token | 15 minutes | ~2KB |
| `refresh_token` | Long-lived token renewal | 7 days | ~2KB |

### Security Attributes

```typescript
const COOKIE_CONFIG = {
  // Cookie names
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  
  // Security attributes
  httpOnly: true,                    // Prevents XSS access
  secure: NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax',                   // CSRF protection
  path: '/',                         // Available site-wide
  domain: COOKIE_DOMAIN,             // Cross-subdomain sharing
  
  // Expiration
  ACCESS_TOKEN_MAX_AGE: 15 * 60,     // 15 minutes
  REFRESH_TOKEN_MAX_AGE: 7 * 24 * 60 * 60, // 7 days
}
```

## 🔒 Security Attributes

### HttpOnly Flag
- **Value**: `true`
- **Purpose**: Prevents JavaScript access to cookies
- **Protection**: XSS attack mitigation
- **Trade-off**: Requires server-side cookie management

### Secure Flag
- **Development**: `false` (allows HTTP)
- **Production**: `true` (requires HTTPS)
- **Purpose**: Prevents transmission over insecure connections
- **Configuration**: Automatic based on `NODE_ENV`

### SameSite Attribute
- **Value**: `lax`
- **Purpose**: CSRF protection while allowing normal navigation
- **Behavior**: 
  - Blocks cookies on cross-site POST requests
  - Allows cookies on top-level navigation
  - Permits cookies on same-site requests

### Path Attribute
- **Value**: `/`
- **Purpose**: Makes cookies available site-wide
- **Scope**: All routes under the domain

### Domain Attribute
- **Development**: `undefined` (current domain only)
- **Production**: `process.env.NEXT_PUBLIC_COOKIE_DOMAIN` (optional)
- **Purpose**: Enable cookie sharing across subdomains
- **Example**: `.forge.com` allows sharing between `app.forge.com` and `api.forge.com`

## 🎫 Token Format

### JWT Structure

Both access and refresh tokens are signed JWTs with the following claims:

```typescript
interface DecodedToken {
  sub: string      // User ID (subject)
  email?: string   // User email address
  name?: string    // User display name
  type: 'access' | 'refresh'  // Token type
  exp: number      // Expiration timestamp (Unix)
  iat: number      // Issued at timestamp (Unix)
  jti: string      // JWT ID for revocation tracking
}
```

### Access Token
- **Purpose**: API request authentication
- **Lifespan**: 15 minutes
- **Usage**: Included automatically in requests
- **Claims**: User identity and permissions

### Refresh Token
- **Purpose**: Access token renewal
- **Lifespan**: 7 days
- **Usage**: Automatic renewal when access token expires
- **Security**: Can be revoked server-side

## 🛠️ Implementation Guide

### Frontend (Next.js)

#### 1. Install Dependencies

```bash
npm install jsonwebtoken @types/jsonwebtoken
```

#### 2. Import Auth Helpers

```typescript
import {
  setAuthCookie,
  clearAuthCookie,
  parseAuthCookie,
  getCurrentUser,
  isAuthenticated,
  COOKIE_CONFIG
} from '@/lib/auth'
```

#### 3. Setting Cookies (Login/Signup)

```typescript
// After successful authentication
const response = NextResponse.next()

setAuthCookie(response, COOKIE_CONFIG.ACCESS_TOKEN, accessToken)
setAuthCookie(response, COOKIE_CONFIG.REFRESH_TOKEN, refreshToken)

return response
```

#### 4. Clearing Cookies (Logout)

```typescript
// On logout
const response = NextResponse.next()

clearAllAuthCookies(response)

return response
```

#### 5. Reading User Info (Middleware)

```typescript
// In middleware.ts
export async function middleware(request: NextRequest) {
  const user = getCurrentUser(request)
  
  if (user) {
    const response = NextResponse.next()
    injectUserHeaders(response, user)
    return response
  }
  
  return NextResponse.next()
}
```

### Backend (FastAPI/Python)

#### 1. Cookie Reading

```python
from fastapi import Request, Response

def get_auth_cookies(request: Request):
    return {
        'access_token': request.cookies.get('access_token'),
        'refresh_token': request.cookies.get('refresh_token')
    }
```

#### 2. Cookie Setting

```python
def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="lax",
        max_age=15*60
    )
    response.set_cookie(
        key="refresh_token", 
        value=refresh_token,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="lax",
        max_age=7*24*60*60
    )
```

#### 3. Cookie Clearing

```python
def clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
```

## 🔄 Cross-Service Integration

### Service Communication

When services need to validate authentication:

1. **Read cookies** from incoming requests
2. **Validate JWT** signature and expiration
3. **Extract user info** from token claims
4. **Forward user context** to business logic

### Header Injection

The middleware automatically injects user context headers:

```http
X-User-ID: 507f1f77bcf86cd799439011
X-User-Email: user@example.com
X-User-Name: John Doe
X-Auth-Type: access
```

### Microservice Auth

Each service should:

1. **Accept** authentication via cookies
2. **Validate** tokens using shared secret/public key
3. **Extract** user info from validated tokens
4. **Respect** token expiration and revocation

## 🌍 Environment Configuration

### Development
```env
NODE_ENV=development
NEXT_PUBLIC_API_ENV=development
# NEXT_PUBLIC_COOKIE_DOMAIN is not set (localhost only)
```

### Staging
```env
NODE_ENV=production
NEXT_PUBLIC_API_ENV=staging
NEXT_PUBLIC_COOKIE_DOMAIN=.staging.forge.com
```

### Production
```env
NODE_ENV=production
NEXT_PUBLIC_API_ENV=production
NEXT_PUBLIC_COOKIE_DOMAIN=.forge.com
```

## 🔧 Token Refresh Flow

### Automatic Refresh

The middleware automatically refreshes tokens when:

1. Access token expires in < 5 minutes
2. Refresh token is still valid
3. User is actively using the application

### Refresh Process

```typescript
// Simplified refresh flow
if (shouldRefreshToken(accessToken)) {
  const result = await refreshAuthTokens(refreshToken, apiBaseUrl)
  
  if (result.success) {
    setAuthCookie(response, COOKIE_CONFIG.ACCESS_TOKEN, result.accessToken)
  } else {
    clearAllAuthCookies(response)
    // Redirect to login
  }
}
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Cookies Not Set
- **Symptom**: Login succeeds but cookies are missing
- **Causes**: 
  - Incorrect domain/path configuration
  - HTTPS required in production but not available
  - SameSite restrictions
- **Solution**: Check cookie attributes and environment configuration

#### 2. Cookies Not Sent
- **Symptom**: Authenticated requests fail unexpectedly
- **Causes**:
  - Cross-origin requests without credentials
  - Expired cookies
  - Domain mismatch
- **Solution**: Verify `credentials: 'include'` in fetch requests

#### 3. Token Refresh Failures
- **Symptom**: Users logged out unexpectedly
- **Causes**:
  - Refresh token expired
  - Backend refresh endpoint issues
  - Network connectivity problems
- **Solution**: Check refresh token validity and endpoint health

#### 4. CORS Issues
- **Symptom**: Cookie-based requests blocked by browser
- **Causes**:
  - Missing CORS credentials configuration
  - Incorrect allowed origins
  - SameSite restrictions
- **Solution**: Configure backend CORS to allow credentials

### Debug Tools

#### Browser DevTools
1. **Application/Storage**: View cookie values and attributes
2. **Network**: Monitor cookie headers in requests/responses
3. **Console**: Check middleware and auth context logs

#### Server Logs
1. **Authentication events**: Login, logout, refresh attempts
2. **Cookie operations**: Set, clear, validation
3. **Error messages**: Token parsing, validation failures

## 📚 Best Practices

### Security
1. **Always use HTTPS** in production
2. **Set appropriate expiration times** for tokens
3. **Implement token revocation** for compromised accounts
4. **Monitor authentication events** for suspicious activity
5. **Use secure random values** for JTI (token IDs)

### Performance
1. **Cache token validation results** when possible
2. **Implement graceful degradation** for auth failures
3. **Use appropriate cookie sizes** to minimize overhead
4. **Batch user context operations** in middleware

### Usability
1. **Provide clear feedback** on auth state changes
2. **Implement seamless token refresh** without user awareness
3. **Preserve user context** across page refreshes
4. **Handle edge cases gracefully** (expired sessions, etc.)

## 🔗 Related Documentation

- [API Authentication Guide](./API_AUTH.md)
- [Middleware Configuration](./MIDDLEWARE.md)
- [Security Best Practices](./SECURITY.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Forge Platform Team
