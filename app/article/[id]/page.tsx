"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ArticlePageSkeleton } from "@/components/skeleton-loader"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"

interface Article {
  id: string
  title: string
  content: string
  coverImage?: string
  author: {
    id: string
    name: string
    avatar?: string
    bio?: string
  }
  tags: string[]
  likes: number
  comments: Comment[]
  createdAt: string
  readTime: number
}

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
}

// Mock data - replace with API calls
const mockArticle: Article = {
  id: "1",
  title: "The Future of Web Development: What to Expect in 2024",
  content: `
    <h2>Introduction</h2>
    <p>Web development continues to evolve at a rapid pace, with new technologies and frameworks emerging regularly. As we look ahead to 2024, several key trends are shaping the future of how we build and interact with web applications.</p>
    
    <h2>AI Integration</h2>
    <p>Artificial Intelligence is becoming increasingly integrated into web development workflows. From AI-powered code completion to automated testing and deployment, developers are leveraging AI to increase productivity and reduce errors.</p>
    
    <h2>Performance Optimization</h2>
    <p>With users expecting faster load times and smoother interactions, performance optimization remains a top priority. New techniques like edge computing and advanced caching strategies are helping developers deliver lightning-fast experiences.</p>
    
    <h2>Conclusion</h2>
    <p>The future of web development is bright, with exciting innovations on the horizon. By staying informed about these trends and continuously learning, developers can build better, more efficient applications that delight users.</p>
  `,
  coverImage: "/placeholder.svg?height=400&width=800",
  author: {
    id: "1",
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Full-stack developer and tech writer passionate about modern web technologies.",
  },
  tags: ["Web Development", "Technology", "AI"],
  likes: 124,
  comments: [
    {
      id: "1",
      content: "Great article! Really insightful perspective on where web development is heading.",
      author: {
        id: "2",
        name: "Michael Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2024-01-15T12:00:00Z",
    },
    {
      id: "2",
      content:
        "I particularly enjoyed the section on AI integration. It's amazing how much it's already changing our workflows.",
      author: {
        id: "3",
        name: "Emily Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2024-01-15T14:30:00Z",
    },
  ],
  createdAt: "2024-01-15T10:00:00Z",
  readTime: 8,
}

export default function ArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      try {
        // Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setArticle(mockArticle)
        setLikesCount(mockArticle.likes)
      } catch (error) {
        console.error("Failed to fetch article:", error)
        toast({
          title: "Error loading article",
          description: "Failed to load the article. Please refresh the page and try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.id])

  const handleLike = () => {
    try {
      setIsLiked(!isLiked)
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))

      toast({
        title: isLiked ? "Removed like" : "Article liked",
        description: isLiked ? "You unliked this article" : "Thanks for liking this article!",
      })
      // TODO: API call to like/unlike
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBookmark = () => {
    try {
      setIsBookmarked(!isBookmarked)

      toast({
        title: isBookmarked ? "Removed bookmark" : "Article bookmarked",
        description: isBookmarked ? "Article removed from bookmarks" : "Article saved to your bookmarks",
      })
      // TODO: API call to bookmark/unbookmark
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          url: window.location.href,
        })
      } catch (error) {
        // Sharing was cancelled or failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const submitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before posting your comment.",
        variant: "destructive",
      })
      return
    }

    setSubmittingComment(true)
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock adding comment
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment,
        author: {
          id: "current-user",
          name: "Current User",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        createdAt: new Date().toISOString(),
      }

      setArticle((prev) =>
        prev
          ? {
              ...prev,
              comments: [...prev.comments, comment],
            }
          : null,
      )

      setNewComment("")

      toast({
        title: "Comment posted",
        description: "Your comment has been successfully posted.",
      })
    } catch (error) {
      toast({
        title: "Error posting comment",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container min-h-screen">
        <Navbar />
        <ArticlePageSkeleton />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="page-container min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Article not found</h1>
          <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Cover Image */}
        {article.coverImage && (
          <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image src={article.coverImage || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
          </div>
        )}

        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground font-serif">{article.title}</h1>

          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-12 w-12 ring-2 ring-border">
              <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                {article.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-foreground">{article.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(article.createdAt).toLocaleDateString()} · {article.readTime} min read
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="error-page-button">
                Follow
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-muted text-foreground border-border">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-y border-border py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center space-x-1 hover:bg-muted ${isLiked ? "text-red-500" : "text-muted-foreground"}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                <span>{likesCount}</span>
              </Button>

              <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>{article.comments.length}</span>
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBookmark} 
                className={`hover:bg-muted ${isBookmarked ? "text-primary" : "text-muted-foreground"}`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare} className="text-muted-foreground hover:bg-muted hover:text-foreground">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="enhanced-card p-8 mb-12">
          <div 
            className="prose prose-lg max-w-none dark:prose-invert text-foreground"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </div>

        <Separator className="my-8 bg-border" />

        {/* Author Bio */}
        <Card className="enhanced-card mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16 ring-2 ring-border">
                <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                  {article.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2 text-foreground">{article.author.name}</h3>
                <p className="text-muted-foreground mb-4">{article.author.bio}</p>
                <Button variant="outline" size="sm" className="error-page-button">
                  Follow
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Comments ({article.comments.length})</h2>

          {/* Add Comment */}
          <Card className="enhanced-card">
            <CardContent className="p-4">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-4 bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button 
                onClick={submitComment} 
                disabled={!newComment.trim() || submittingComment}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white error-page-button"
              >
                {submittingComment ? "Posting..." : "Post Comment"}
              </Button>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            {article.comments.map((comment) => (
              <Card key={comment.id} className="enhanced-card">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8 ring-1 ring-border">
                      <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                        {comment.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-sm text-foreground">{comment.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-foreground">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
