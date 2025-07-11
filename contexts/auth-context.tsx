"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { API_CONFIG } from "@/lib/api-config"
import { COOKIE_CONFIG } from "@/lib/auth/shared"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  emailVerified: boolean
  isActive: boolean
  lastLoginAt?: string
  loginCount: number
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  refreshUser: () => Promise<void>
  refreshToken: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  resendVerificationEmail: () => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  loading: boolean
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false) // Prevent multiple refresh calls

  const isAuthenticated = !!user
  

  const clearError = () => setError(null)

  // Helper function to handle API errors
  const handleApiError = (error: any, defaultMessage: string): never => {
    if (error?.detail) {
      throw new Error(error.detail)
    } else if (error?.message) {
      throw new Error(error.message)
    } else if (typeof error === 'string') {
      throw new Error(error)
    } else {
      throw new Error(defaultMessage)
    }
  }

  // Helper to check if we should attempt auth validation
  // Since cookies are httpOnly, we can't read them directly
  // Instead, we'll try to make an API call and see if it works
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      if (typeof window !== 'undefined') {
        const response = await fetch(API_CONFIG.USERS.ME, {
          method: 'GET',
          credentials: 'include',
        })
        return response.ok
      }
      return false
    } catch (error) {
      return false
    }
  }

  const refreshUser = async () => {
    // Prevent multiple simultaneous refresh calls
    if (refreshing) {
      return
    }
    
    try {
      setRefreshing(true)
      const response = await fetch(API_CONFIG.USERS.ME, {
        method: "GET",
        credentials: 'include',
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else if (response.status === 401) {
        if (!user) {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setRefreshing(false)
    }
  }

  // Clean up any old localStorage tokens on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const oldTokens = ['forge_token', 'token', 'access_token', 'refresh_token']
      oldTokens.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key)
        }
      })
    }
  }, [])

  // Initialize auth state from cookies/session
  useEffect(() => {
    const initializeAuth = async () => {
      await refreshUser()
      setLoading(false)
    }

    const timeoutId = setTimeout(initializeAuth, 100)
    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      if (!user && !loading) {
        refreshUser()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [user, loading])

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setLoading(true)
      setError(null)

      // Basic validation
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long")
      }

      // Use OAuth2 form data format for login (as backend expects)
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)
      if (rememberMe) {
        formData.append('rememberMe', 'true')
      }

      const response = await fetch(API_CONFIG.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: 'include', // Include cookies
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        handleApiError(data, "Login failed")
      }

      // Backend returns { user: UserResponse, message: string }
      setUser(data.user)
      setLoading(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed. Please try again.")
      setLoading(false) // Set loading false here for errors too
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      setError(null)

      // Validation
      if (!name.trim()) {
        throw new Error("Name is required")
      }

      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long")
      }

      const response = await fetch(API_CONFIG.AUTH.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        handleApiError(data, "Registration failed")
      }

      // Backend returns success message, not user object for register
      // User needs to verify email first
    } catch (error) {
      setError(error instanceof Error ? error.message : "Signup failed. Please try again.")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      
      await fetch(API_CONFIG.AUTH.LOGOUT, {
        method: "POST",
        credentials: 'include', // Include cookies
      })
    } catch (error) {
      // Logout request failed, clearing local state anyway
    } finally {
      setUser(null)
      setError(null)
      setLoading(false)
    }
  }

  const logoutAll = async () => {
    try {
      setLoading(true)
      
      await fetch(API_CONFIG.AUTH.LOGOUT_ALL, {
        method: "POST",
        credentials: 'include', // Include cookies
      })
    } catch (error) {
      // Logout all request failed, clearing local state anyway
    } finally {
      setUser(null)
      setError(null)
      setLoading(false)
    }
  }


  const refreshToken = async () => {
    try {
      const response = await fetch(API_CONFIG.AUTH.REFRESH, {
        method: "POST",
        credentials: 'include', // Include cookies
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      // Refresh user data after token refresh
      await refreshUser()
    } catch (error) {
      setUser(null)
      throw error
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_CONFIG.AUTH.FORGOT_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        handleApiError(data, "Failed to send reset email")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send reset email")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setLoading(true)
      setError(null)

      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long")
      }

      const response = await fetch(API_CONFIG.AUTH.RESET_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        handleApiError(data, "Failed to reset password")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to reset password")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true)
      setError(null)

      if (newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters long")
      }

      const response = await fetch(API_CONFIG.AUTH.CHANGE_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        handleApiError(data, "Failed to change password")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to change password")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resendVerificationEmail = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user?.email) {
        throw new Error("No email address found")
      }

      const response = await fetch(API_CONFIG.AUTH.RESEND_VERIFICATION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email: user.email }),
      })

      const data = await response.json()

      if (!response.ok) {
        handleApiError(data, "Failed to resend verification email")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to resend verification email")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const verifyEmail = async (token: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_CONFIG.AUTH.VERIFY_EMAIL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies (though user isn't logged in yet)
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        handleApiError(data, "Email verification failed")
      }

      // Don't call refreshUser() here - user isn't logged in yet, just verified email
      // They need to go to login page and sign in with their verified account
    } catch (error) {
      setError(error instanceof Error ? error.message : "Email verification failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated,
        login, 
        signup, 
        logout, 
        logoutAll,
        refreshUser, 
        refreshToken,
        forgotPassword,
        resetPassword,
        changePassword,
        resendVerificationEmail,
        verifyEmail,
        loading,
        error,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
