"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ArticleCard } from "@/components/article-card"
import { ArticleCardSkeleton } from "@/components/skeleton-loader"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Mock data - replace with API calls
const mockSearchResults = [
  {
    id: "1",
    title: "Getting Started with React Hooks",
    excerpt: "A comprehensive guide to understanding and using React Hooks in your applications.",
    content: "",
    coverImage: "/placeholder.svg?height=300&width=600",
    author: {
      id: "1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["React", "JavaScript", "Hooks"],
    likes: 67,
    comments: 15,
    createdAt: "2024-01-12T10:00:00Z",
    readTime: 7,
  },
  {
    id: "2",
    title: "Modern CSS Techniques for Better Layouts",
    excerpt: "Explore CSS Grid, Flexbox, and other modern techniques for creating responsive layouts.",
    content: "",
    coverImage: "/placeholder.svg?height=300&width=600",
    author: {
      id: "2",
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["CSS", "Web Design", "Layout"],
    likes: 89,
    comments: 22,
    createdAt: "2024-01-11T14:30:00Z",
    readTime: 9,
  },
]

const popularTags = [
  "JavaScript",
  "React",
  "Web Development",
  "CSS",
  "Node.js",
  "Python",
  "AI",
  "Machine Learning",
  "Design",
  "Career",
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState(mockSearchResults)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (query: string = searchQuery, tags: string[] = selectedTags) => {
    if (!query.trim() && tags.length === 0) {
      toast({
        title: "Search query required",
        description: "Please enter a search term or select tags to search.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      // Replace with actual API call
      const params = new URLSearchParams()
      if (query.trim()) params.append("q", query.trim())
      if (tags.length > 0) params.append("tags", tags.join(","))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock filtering based on search
      let results = mockSearchResults
      if (query.trim()) {
        results = results.filter(
          (article) =>
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(query.toLowerCase()),
        )
      }
      if (tags.length > 0) {
        results = results.filter((article) => article.tags.some((tag) => tags.includes(tag)))
      }

      setSearchResults(results)

      toast({
        title: "Search completed",
        description: `Found ${results.length} article${results.length !== 1 ? "s" : ""} matching your search.`,
      })
    } catch (error) {
      console.error("Search failed:", error)
      toast({
        title: "Search failed",
        description: "Failed to search articles. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag]
      setSelectedTags(newTags)
      handleSearch(searchQuery, newTags)
    }
  }

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag)
    setSelectedTags(newTags)
    handleSearch(searchQuery, newTags)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSelectedTags([])
    setSearchResults([])
    setHasSearched(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="page-container min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-foreground font-serif">Search Articles</h1>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for articles, topics, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-12 bg-background border-border text-foreground"
            />
            {(searchQuery || selectedTags.length > 0) && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-muted"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button onClick={() => handleSearch()} className="w-full mb-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white error-page-button">
            Search
          </Button>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="default" className="px-3 py-1 bg-primary text-primary-foreground">
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Popular Tags */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-foreground">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedTags.includes(tag) 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                  }`}
                  onClick={() => (selectedTags.includes(tag) ? removeTag(tag) : addTag(tag))}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        ) : hasSearched ? (
          searchResults.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Found {searchResults.length} article{searchResults.length !== 1 ? "s" : ""}
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </>
          ) : (
            <Card className="enhanced-card">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg error-icon-shadow">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">No articles found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search terms or browse popular tags.</p>
                <Button variant="outline" onClick={clearSearch} className="error-page-button">
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )
        ) : (
          <Card className="enhanced-card">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg error-icon-shadow">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Discover Great Content</h3>
              <p className="text-muted-foreground">
                Search for articles by keywords or explore popular tags to find content that interests you.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
