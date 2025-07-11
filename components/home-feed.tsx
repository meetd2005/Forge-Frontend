"use client"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Bookmark, MoreHorizontal, X, Plus, Star } from "lucide-react"
import { GET_POSTS } from "@/lib/graphql/posts"
import Link from "next/link"
import Image from "next/image"

// Mock data for articles
const mockArticles = [
  {
    id: "1",
    author: {
      name: "Marshall Hargrave",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "9 Microniche SaaS Ideas With No Competition (But Massive Demand)",
    subtitle: "How to Build a $50k/Month Business in Overlooked Markets",
    image: "/placeholder.svg?height=200&width=300",
    date: "Jun 11",
    readTime: "6 min read",
    claps: "1.6K",
    comments: 47,
    tags: ["Business", "SaaS", "Entrepreneurship"],
  },
  {
    id: "2",
    author: {
      name: "Sohail Saffi",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "The 6 Programming Languages That Will Be Obsolete by 2026 (Are You Still Using Them?)",
    subtitle: "Future-proof your career by learning what's coming next",
    image: "/placeholder.svg?height=200&width=300",
    date: "Apr 29",
    readTime: "8 min read",
    claps: "1.6K",
    comments: 118,
    tags: ["Programming", "Technology", "Career"],
  },
  {
    id: "3",
    author: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "Why I Quit My $200K Job to Build a Newsletter (And How It's Going)",
    subtitle: "The reality of leaving corporate life for creator economy",
    image: "/placeholder.svg?height=200&width=300",
    date: "Jun 8",
    readTime: "5 min read",
    claps: "892",
    comments: 34,
    tags: ["Career", "Newsletter", "Creator Economy"],
  },
]

const staffPicks = [
  {
    id: "1",
    title: "The New and Hopeful Science of Hope",
    author: "Robert Roy Britt",
    publication: "Wise & Well",
    date: "4d ago",
    featured: true,
  },
  {
    id: "2",
    title: "My Son Is Now a Proper Generation Alpha Latchkey Kid",
    author: "Russell Eveleigh",
    publication: "Dev Genius",
    date: "Jun 13",
    featured: true,
  },
  {
    id: "3",
    title: "Diary of a Brand: A24",
    author: "Michelle Wiles",
    date: "3d ago",
    featured: false,
  },
]

const recommendedTopics = [
  "Data Science",
  "Self Improvement",
  "Writing",
  "Relationships",
  "Machine Learning",
  "Productivity",
  "Psychology",
]

export function HomeFeed() {
  const [activeTab, setActiveTab] = useState("For you")
  const [showMembershipBanner, setShowMembershipBanner] = useState(true)

  // Fetch posts from GraphQL API
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: {
      page: 1,
      perPage: 10,
      published: true, // Only show published posts in home feed
    },
    errorPolicy: 'all'
  })

  const posts = data?.posts?.posts || []

  const tabs = [
    "For you",
    "Following",
    { name: "Featured", badge: "New" },
    "Design",
    "Startup",
    "Science",
    "Programming",
  ]

  return (
    <div className="page-container min-h-screen">
      <div className="navbar-enhanced">
        <Navbar />
      </div>

      {/* Membership Banner */}
      {showMembershipBanner && (
        <div className="membership-banner border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600 dark:text-yellow-400">⚡</span>
                <span className="text-sm text-foreground">
                  Get unlimited access to the best of Forge for less than $1/week.{" "}
                  <Link href="/membership" className="underline font-medium text-primary hover:text-primary/80 transition-colors">
                    Become a member
                  </Link>
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMembershipBanner(false)}
                className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="flex items-center space-x-8 border-b border-border mb-8">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-5 w-5" />
              </Button>

              {tabs.map((tab) => {
                const tabName = typeof tab === "string" ? tab : tab.name
                const isActive = activeTab === tabName

                return (
                  <button
                    key={tabName}
                    onClick={() => setActiveTab(tabName)}
                    className={`home-feed-tab pb-4 px-1 border-b-2 transition-all duration-200 relative ${
                      isActive
                        ? "active border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="text-sm font-medium">{tabName}</span>
                    {typeof tab === "object" && tab.badge && (
                      <Badge className="ml-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs px-2 py-0 shadow-sm">
                        {tab.badge}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Articles Feed */}
            <div className="space-y-8">
              {loading && (
                <div className="space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="enhanced-card p-6 rounded-xl">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-muted rounded-full"></div>
                          <div className="h-4 bg-muted rounded w-24"></div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 space-y-3">
                            <div className="h-6 bg-muted rounded"></div>
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                          </div>
                          <div className="w-full h-32 bg-muted rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <div className="enhanced-card p-8 rounded-xl">
                    <p className="text-muted-foreground mb-4">Failed to load articles</p>
                    <p className="text-sm text-red-500 mb-4">{error.message}</p>
                    <Button onClick={() => refetch()} variant="outline">
                      Try Again
                    </Button>
                  </div>
                </div>
              )}

              {!loading && !error && posts.length === 0 && (
                <div className="text-center py-8">
                  <div className="enhanced-card p-8 rounded-xl">
                    <p className="text-muted-foreground mb-4">No articles found</p>
                    <p className="text-sm text-muted-foreground mb-4">Be the first to share your thoughts with the community!</p>
                    <Link href="/editor">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Write your first article
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {!loading && posts.map((post) => {
                // Transform post data to expected format
                const article = {
                  id: post.id,
                  title: post.title,
                  content: post.content,
                  excerpt: post.content?.substring(0, 150) + "..." || "No excerpt available",
                  author: {
                    name: post.authorName || "Anonymous",
                    avatar: null, // Not implemented yet
                  },
                  tags: post.tags || [],
                  createdAt: post.createdAt,
                  readTime: Math.max(1, Math.ceil((post.content?.length || 0) / 200)),
                  likes: 0, // Not implemented yet
                  comments: 0, // Not implemented yet
                }
                
                return (
                  <article key={article.id} className="group">
                    <div className="article-card enhanced-card p-6 rounded-xl transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <Avatar className="avatar-enhanced h-8 w-8 mt-1 ring-2 ring-border">
                          <AvatarImage src={article.author?.avatar || "/placeholder.svg"} alt={article.author?.name || "Unknown"} />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-600 text-white text-xs">
                            {article.author?.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-sm font-medium text-foreground">
                              {article.author?.name || "Anonymous"}
                            </span>
                          </div>

                          <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                              <Link href={`/article/${article.id}`} className="group">
                                <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 font-serif">
                                  {article.title}
                                </h2>
                                <p className="text-muted-foreground mb-4 line-clamp-2">
                                  {article.excerpt || "No excerpt available"}
                                </p>
                              </Link>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                                  <span>·</span>
                                  <span>{article.readTime} min read</span>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                                    <span>{article.likes}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MessageCircle className="h-3 w-3" />
                                    <span>{article.comments}</span>
                                  </div>
                                </div>

                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="home-feed-action-btn h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="home-feed-action-btn h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                  <Bookmark className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="home-feed-action-btn h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Article Tags */}
                            <div className="flex flex-wrap gap-2 mt-4">
                              {article.tags?.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="topic-badge text-xs px-2 py-1 text-muted-foreground border-border hover:border-primary hover:text-primary cursor-pointer"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="md:col-span-1">
                            {article.coverImage && (
                              <div className="article-image">
                                <Image
                                  src={article.coverImage || "/placeholder.svg"}
                                  alt={article.title}
                                  width={200}
                                  height={134}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </article>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Staff Picks */}
            <div className="enhanced-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span>Staff Picks</span>
              </h3>
              <div className="space-y-4">
                {staffPicks.map((pick) => (
                  <div key={pick.id} className="staff-picks-item group">
                    <div className="flex items-start space-x-3">
                      <Avatar className="avatar-enhanced h-6 w-6 mt-1 ring-1 ring-border">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" alt={pick.author} />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                          {pick.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-1">
                          {pick.publication && (
                            <>
                              <span className="font-medium text-foreground">{pick.publication}</span>
                              <span>in</span>
                            </>
                          )}
                          <span>{pick.author}</span>
                        </div>

                        <Link href={`/article/${pick.id}`} className="group">
                          <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                            {pick.title}
                          </h4>
                        </Link>

                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          {pick.featured && <Star className="h-3 w-3 fill-current text-yellow-500" />}
                          <span>{pick.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/staff-picks"
                className="text-sm text-primary hover:text-primary/80 hover:underline mt-4 block font-medium transition-colors"
              >
                See the full list →
              </Link>
            </div>

            {/* Recommended Topics */}
            <div className="enhanced-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Recommended topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {recommendedTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="secondary"
                    className="topic-badge px-3 py-1 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground cursor-pointer transition-all duration-200 border border-border hover:border-primary/20 hover:shadow-sm"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
