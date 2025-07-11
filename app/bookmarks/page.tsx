"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { ArticleCard } from "@/components/article-card"
import { ArticleCardSkeleton } from "@/components/skeleton-loader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Mock data - replace with API calls
const mockBookmarkedArticles = [
  {
    id: "1",
    title: "Advanced React Patterns You Should Know",
    excerpt:
      "Exploring compound components, render props, and other advanced React patterns that can improve your code.",
    content: "",
    coverImage: "/placeholder.svg?height=300&width=600",
    author: {
      id: "1",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["React", "JavaScript", "Patterns"],
    likes: 89,
    comments: 12,
    createdAt: "2024-01-08T14:30:00Z",
    readTime: 10,
  },
  {
    id: "2",
    title: "The Complete Guide to CSS Grid",
    excerpt: "Master CSS Grid with this comprehensive guide covering everything from basics to advanced techniques.",
    content: "",
    coverImage: "/placeholder.svg?height=300&width=600",
    author: {
      id: "2",
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["CSS", "Web Design", "Layout"],
    likes: 156,
    comments: 24,
    createdAt: "2024-01-07T09:15:00Z",
    readTime: 12,
  },
]

export default function BookmarksPage() {
  const [bookmarkedArticles, setBookmarkedArticles] = useState(mockBookmarkedArticles)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true)
      try {
        // Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // Fetch user's bookmarked articles

        toast({
          title: "Bookmarks loaded",
          description: `Loaded ${bookmarkedArticles.length} bookmarked articles.`,
        })
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error)
        toast({
          title: "Error loading bookmarks",
          description: "Failed to load your bookmarks. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [])

  return (
    <ProtectedRoute>
      <div className="page-container min-h-screen">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground font-serif">Your Bookmarks</h1>
            <p className="text-muted-foreground">Articles you've saved to read later or reference again.</p>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : bookmarkedArticles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookmarkedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <Card className="enhanced-card">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg error-icon-shadow">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-foreground font-serif">No bookmarks yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start bookmarking articles you want to read later or reference again. Click the bookmark icon on any
                  article to save it here.
                </p>
                <Button asChild className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white error-page-button">
                  <a href="/">Discover Articles</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
