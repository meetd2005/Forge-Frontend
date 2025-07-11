"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { API_CONFIG } from "@/lib/api-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function AuthSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const hasCompleted = useRef(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()

  useEffect(() => {
    if (hasCompleted.current) return // Prevent multiple calls
    
    const completeOAuth = async () => {
      try {
        // Mark as starting to prevent multiple calls immediately
        hasCompleted.current = true
        setLoading(true)
        
        // Get exchange token from URL
        const exchangeToken = searchParams.get('token')
        if (!exchangeToken) {
          throw new Error('No exchange token found in URL')
        }
        
        // Starting OAuth completion process
        
        // Complete OAuth login by sending exchange token to backend (only once)
        const response = await fetch(API_CONFIG.AUTH.OAUTH_COMPLETE, {
          method: "POST",
          credentials: "include", // Essential: for setting cookies
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ exchange_token: exchangeToken })
        })
        

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('❌ OAuth completion failed:', response.status, errorData)
          
          // Handle specific error cases
          if (response.status === 401 && errorData.detail?.includes('Invalid or expired exchange token')) {
            throw new Error('The authentication token has expired. Please try signing in again.')
          }
          
          throw new Error(errorData.detail || `Authentication failed (${response.status})`)
        }

        const data = await response.json()
        
        if (data.user) {
          // Set success state immediately
          setSuccess(true)
          
          // Clear the token from URL to prevent reuse
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href)
            url.searchParams.delete('token')
            window.history.replaceState({}, document.title, url.toString())
          }
          
          // Show success toast
          toast({
            title: "Welcome to Forge!",
            description: "You have successfully signed in with Google.",
          })
          
          // Update auth context after success and wait for it to complete
          try {
            await refreshUser()
            console.log('✓ User data refreshed after OAuth completion')
          } catch (refreshError) {
            console.warn('⚠️ Failed to refresh user data:', refreshError)
            // Auth context refresh will happen on next API call anyway
          }
          
          // Check for stored redirect path (same logic as regular login)
          const redirectPath = localStorage.getItem("forge_redirect_after_login")
          if (redirectPath) {
            localStorage.removeItem("forge_redirect_after_login")
          }
          
          // Redirect to stored path or home page
          setTimeout(() => {
            router.push(redirectPath || "/")
          }, 1500)
        } else {
          throw new Error('No user data received from server')
        }
        
      } catch (error) {
        // Reset completion flag on error so user can retry
        hasCompleted.current = false
        
        console.error('❌ OAuth completion failed:', error)
        const errorMessage = error instanceof Error ? error.message : "Google authentication failed"
        setError(errorMessage)
        
        toast({
          title: "Authentication failed",
          description: errorMessage,
          variant: "destructive",
        })
        
        // Redirect to login page after delay
        setTimeout(() => {
          router.push('/login?error=oauth_failed')
        }, 3000)
      } finally {
        setLoading(false)
      }
    }

    completeOAuth()
  }, [searchParams, router]) // Removed refreshUser from dependencies

  if (loading) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center px-4">
        <Card className="enhanced-card w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
            <CardTitle className="text-2xl font-serif text-foreground">
              Completing Sign In
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Please wait while we complete your Google authentication...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center px-4">
        <Card className="enhanced-card w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-serif text-foreground">
              Welcome to Forge!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              You have successfully signed in with Google. Redirecting to your dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center px-4">
        <Card className="enhanced-card w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-serif text-foreground">
              Authentication Failed
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              There was an issue with your Google authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
              >
                Back to Sign In
              </Button>
              <Button
                onClick={() => router.push("/signup")}
                variant="outline"
                className="w-full"
              >
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
