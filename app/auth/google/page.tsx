"use client"

import { useEffect } from "react"
import { API_CONFIG } from "@/lib/api-config"

export default function GoogleAuthPage() {
  useEffect(() => {
    // Immediately redirect to Google OAuth endpoint
    window.location.href = API_CONFIG.AUTH.GOOGLE_OAUTH
  }, [])

  return (
    <div className="page-container min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
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
        <h2 className="text-xl font-serif text-foreground mb-2">Redirecting to Google...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you to Google for authentication.</p>
      </div>
    </div>
  )
}
