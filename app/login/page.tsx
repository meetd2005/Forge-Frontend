"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { API_CONFIG } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { GoogleOAuthButton } from "@/components/google-oauth-button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [emailNotVerified, setEmailNotVerified] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setEmailNotVerified(false)

    try {
      await login(email, password)

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in to Forge.",
      })

      // Check for stored redirect path
      const redirectPath = localStorage.getItem("forge_redirect_after_login")
      if (redirectPath) {
        localStorage.removeItem("forge_redirect_after_login")
        router.push(redirectPath)
      } else {
        router.push("/")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid email or password"
      
      // Check if error is specifically about email not being verified
      if (errorMessage === "Email not verified") {
        setEmailNotVerified(true)
        setError("")
      } else {
        setError(errorMessage)
        setEmailNotVerified(false)
        
        toast({
          title: "Sign in failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first.",
        variant: "destructive",
      })
      return
    }

    setResendingEmail(true)
    try {
      // Call the resend verification API directly since we don't have a user context yet
      const response = await fetch(API_CONFIG.AUTH.RESEND_VERIFICATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast({
          title: "Email sent!",
          description: "Verification email has been resent. Please check your inbox.",
        })
      } else {
        const data = await response.json()
        throw new Error(data.detail || "Failed to resend email")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resend email. Please try again."
      toast({
        title: "Resend failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setResendingEmail(false)
    }
  }

  return (
    <div className="page-container min-h-screen flex items-center justify-center px-4">
      <Card className="enhanced-card w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"></path>
              <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"></path>
              <path d="m2.3 2.3 7.286 7.286"></path>
              <circle cx="11" cy="11" r="2"></circle>
            </svg>
          </div>
          <CardTitle className="text-2xl font-serif text-foreground">
            Welcome back to Forge
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to continue your reading journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {emailNotVerified && (
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Your email address has not been verified. 
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal underline ml-1"
                    onClick={handleResendEmail}
                    disabled={resendingEmail}
                  >
                    {resendingEmail ? "Sending..." : "Resend verification email"}
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-border text-foreground"
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <GoogleOAuthButton text="Sign in with Google" />

          <div className="mt-6 text-center space-y-2">
            <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
              Forgot your password?
            </Link>
            <p className="text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
