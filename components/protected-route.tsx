"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ children, requireAuth = true, redirectTo = "/login" }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Add a small delay to prevent race conditions with auth initialization
    const checkAuthTimeout = setTimeout(() => {
      if (!loading && requireAuth && !user) {
        
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page.",
          variant: "destructive",
        })

        // Store the current path to redirect back after login
        const currentPath = window.location.pathname
        localStorage.setItem("forge_redirect_after_login", currentPath)

        router.push(redirectTo)
      }
    }, 500) // 500ms delay to allow auth state to stabilize
    
    return () => clearTimeout(checkAuthTimeout)
  }, [user, loading, requireAuth, router, redirectTo])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null
  }

  return <>{children}</>
}
