"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { PostsDashboard } from "@/components/posts-dashboard"

export default function MyPostsPage() {
  return (
    <ProtectedRoute>
      <div className="page-container min-h-screen">
        {/* Header */}
        <header className="navbar-enhanced sticky top-0 z-50 border-b backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                    <polygon points="18,2 22,6 12,16 8,16 8,12 18,2"></polygon>
                  </svg>
                </div>
                <span className="font-serif text-xl font-normal text-primary-light dark:text-primary-dark">
                  My Posts
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <PostsDashboard showMyPosts={true} />
        </div>
      </div>
    </ProtectedRoute>
  )
}
