"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Application Error:", error)
  }, [error])

  return (
    <html>
      <body className="page-container">
        <div className="min-h-screen flex items-center justify-center px-4">
          <Card className="enhanced-card w-full max-w-md">
            <CardHeader className="text-center">          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg error-icon-shadow">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
              <CardTitle className="text-2xl font-serif text-foreground">Critical Error</CardTitle>
              <CardDescription className="text-muted-foreground">
                A critical error occurred that prevented the application from loading properly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">            <div className="error-message-container rounded-lg p-4">
              <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                <strong>What happened?</strong>
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                The application encountered a critical error and needs to be restarted. This could be due to a network
                issue, server problem, or corrupted data.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <Button
                onClick={reset}
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white error-page-button"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Restart Application
              </Button>

              <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full error-page-button">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </div>

              <div className="text-center pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  If this problem persists, please contact support or try again later.
                </p>
              </div>

              {process.env.NODE_ENV === "development" && (
                <details className="mt-4">
                  <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                    Technical Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-muted rounded text-xs font-mono text-muted-foreground overflow-auto max-h-32">
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
      </body>
    </html>
  )
}
