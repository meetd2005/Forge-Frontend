"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { UserAvatar } from "@/components/user-avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react"
import { useState } from "react"

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  tags: string[]
  likes: number
  comments: number
  createdAt: string
  readTime: number
}

interface ArticleCardProps {
  article: Article
  showBookmark?: boolean
}

export function ArticleCard({ article, showBookmark = true }: ArticleCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(article.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
    // TODO: API call to like/unlike
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // TODO: API call to bookmark/unbookmark
  }

  return (
    <Card className="enhanced-card overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {article.coverImage && (
          <div className="relative h-48 w-full">
            <Image src={article.coverImage || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
          </div>
        )}

        <div className="p-6">
          {/* Author Info */}
          <div className="flex items-center space-x-3 mb-4">
            <UserAvatar user={article.author} size="md" />
            <div className="flex-1">
              <p className="text-sm font-medium">{article.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(article.createdAt).toLocaleDateString()} · {article.readTime} min read
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Article Content */}
          <Link href={`/article/${article.id}`} className="block group">
            <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h2>
            <p className="text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center space-x-1 ${isLiked ? "text-red-500" : ""}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm">{likesCount}</span>
              </Button>

              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{article.comments}</span>
              </Button>
            </div>

            {showBookmark && (
              <Button variant="ghost" size="sm" onClick={handleBookmark} className={isBookmarked ? "text-primary" : ""}>
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
