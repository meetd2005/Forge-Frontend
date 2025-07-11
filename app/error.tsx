"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error)
  }, [error])

  const getErrorMessage = () => {
    if (error.message.includes("fetch")) {
      return {
        title: "Connection Error",
        description: "Unable to connect to our servers. Please check your internet connection and try again.",
        suggestion: "Check your network connection or try refreshing the page.",
      }
    }

    if (error.message.includes("timeout")) {
      return {
        title: "Request Timeout",
        description: "The request took too long to complete. This might be due to a slow connection.",
        suggestion: "Please try again or check your internet connection.",
      }
    }

    if (error.message.includes("unauthorized") || error.message.includes("401")) {
      return {
        title: "Authentication Error",
        description: "Your session has expired or you don't have permission to access this resource.",
        suggestion: "Please sign in again to continue.",
      }
    }

    return {
      title: "Something went wrong",
      description: "An unexpected error occurred while loading this page.",
      suggestion: "Try refreshing the page or go back to the homepage.",
    }
  }

  const errorInfo = getErrorMessage()

  return (
    <div className="page-container min-h-screen flex items-center justify-center px-4">
      <Card className="enhanced-card w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg error-icon-shadow">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-serif text-foreground">
            {errorInfo.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {errorInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="error-message-container rounded-lg p-4">
            <p className="text-sm text-red-700 dark:text-red-300 mb-2">
              <strong>What can you do?</strong>
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">{errorInfo.suggestion}</p>
          </div>

          <div className="flex flex-col space-y-3">
            <Button onClick={reset} className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white error-page-button">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => window.history.back()} className="flex-1 error-page-button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button variant="outline" asChild className="flex-1 error-page-button">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
            </div>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                Technical Details (Development)
              </summary>                <div className="mt-2 p-3 bg-muted rounded text-xs font-mono text-muted-foreground overflow-auto max-h-32">
                <p>
                  <strong>Error:</strong> {error.message}
                </p>
                {error.digest && (
                  <p>
                    <strong>Digest:</strong> {error.digest}
                  </p>
                )}
                {error.stack && (
                  <div className="mt-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap text-xs">{error.stack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
