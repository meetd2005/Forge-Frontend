"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Home, LogIn, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="page-container min-h-screen flex items-center justify-center px-4">
      <Card className="enhanced-card w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg error-icon-shadow">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-serif text-foreground">Access Denied</CardTitle>
          <CardDescription className="text-muted-foreground">
            You don't have permission to access this resource.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="warning-message-container rounded-lg p-4">
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
              <strong>Why am I seeing this?</strong>
            </p>
            <ul className="text-sm text-orange-600 dark:text-orange-400 space-y-1">
              <li>• You may need to sign in to access this content</li>
              <li>• Your account might not have the required permissions</li>
              <li>• This content may be restricted to premium members</li>
              <li>• Your session may have expired</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white error-page-button">
              <Link href="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
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

          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Need help?</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/help">Help Center</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/membership">Membership</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
