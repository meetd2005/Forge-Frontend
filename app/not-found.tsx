"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileQuestion, Home, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="page-container min-h-screen flex items-center justify-center px-4">
      <Card className="enhanced-card w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg error-icon-shadow">
            <FileQuestion className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-serif text-foreground">
            Page Not Found
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="info-message-container rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
              <strong>What happened?</strong>
            </p>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <li>• The URL might be typed incorrectly</li>
              <li>• The page may have been moved or deleted</li>
              <li>• You might not have permission to view this page</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white error-page-button">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Link>
            </Button>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => window.history.back()} className="flex-1 error-page-button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button variant="outline" asChild className="flex-1 error-page-button">
                <Link href="/search">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Link>
              </Button>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Looking for something specific?</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/about">About</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/membership">Membership</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/editor">Write</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
