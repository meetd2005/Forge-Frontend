"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { API_CONFIG } from "@/lib/api-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function GoogleCallbackPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const error = searchParams.get("error")
        const state = searchParams.get("state")

        // Check for OAuth errors
        if (error) {
          throw new Error(`Google OAuth error: ${error}`)
        }

        if (!code) {
          throw new Error("No authorization code received from Google")
        }

        // The callback URL processing is now handled by the backend
        // We just need to call the OAuth completion endpoint
        const response = await fetch(API_CONFIG.AUTH.OAUTH_COMPLETE, {
          method: "POST",
          credentials: "include", // Include cookies for auth
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail || "Google authentication failed")
        }

        // Set success state
        setSuccess(true)
        
        // Update auth context with user data from backend
        if (data.user) {
          await refreshUser()
        }

        // Show success toast
        toast({
          title: "Welcome to Forge!",
          description: "You have successfully signed in with Google.",
        })

        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          router.push("/")
        }, 2000)

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Google authentication failed"
        setError(errorMessage)
        
        toast({
          title: "Authentication failed",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [searchParams, router, refreshUser])

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
