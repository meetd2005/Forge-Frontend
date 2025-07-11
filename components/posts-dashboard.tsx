"use client"

import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { 
  GET_POSTS, 
  GET_POSTS_BY_AUTHOR, 
  DELETE_POST, 
  PUBLISH_POST,
  type Post,
  type PostsResponse 
} from "@/lib/graphql/posts"
import { 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  Calendar, 
  User, 
  Search,
  Plus,
  Globe,
  FileText,
  MoreVertical
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface PostsDashboardProps {
  showMyPosts?: boolean
}

export function PostsDashboard({ showMyPosts = false }: PostsDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { user } = useAuth()
  const { toast } = useToast()

  // Query for all posts or user's posts
  const { data: postsData, loading: postsLoading, refetch: refetchPosts } = useQuery(GET_POSTS, {
    variables: {
      page: 1,
      perPage: 20,
      search: searchTerm || undefined,
      published: activeTab === "published" ? true : activeTab === "drafts" ? false : undefined,
      authorId: showMyPosts ? user?.id : undefined
    },
    skip: !user
  })

  // Query for user's posts
  const { data: myPostsData, loading: myPostsLoading } = useQuery(GET_POSTS_BY_AUTHOR, {
    variables: { authorId: user?.id || "" },
    skip: !user?.id || !showMyPosts
  })

  // Delete post mutation
  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: (data) => {
      if (data.deletePost.success) {
        toast({
          title: "Post deleted",
          description: "Your post has been successfully deleted.",
        })
        refetchPosts()
      } else {
        toast({
          title: "Failed to delete post",
          description: data.deletePost.message,
          variant: "destructive",
        })
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to delete post",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  // Publish post mutation
  const [publishPost] = useMutation(PUBLISH_POST, {
    onCompleted: (data) => {
      if (data.publishPost.success) {
        toast({
          title: "Post published",
          description: "Your post is now live and visible to readers!",
        })
        refetchPosts()
      } else {
        toast({
          title: "Failed to publish post",
          description: data.publishPost.message,
          variant: "destructive",
        })
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to publish post",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const handleDeletePost = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      await deletePost({ variables: { id: postId } })
    }
  }

  const handlePublishPost = async (postId: string) => {
    await publishPost({ variables: { id: postId } })
  }

  const posts = postsData?.posts?.posts || myPostsData?.postsByAuthor || []
  const loading = postsLoading || myPostsLoading

  const filteredPosts = posts.filter((post: Post) => {
    if (activeTab === "published") return post.published
    if (activeTab === "drafts") return !post.published
    return true
  })

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {showMyPosts ? "My Posts" : "All Posts"}
          </h2>
          <p className="text-muted-foreground">
            {showMyPosts 
              ? "Manage and edit your published articles and drafts" 
              : "Discover and read articles from the community"
            }
          </p>
        </div>
        {showMyPosts && (
          <Button asChild className="gradient-button">
            <Link href="/editor">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {activeTab === "drafts" 
                    ? "You don't have any drafts yet. Start writing to create your first draft."
                    : activeTab === "published"
                    ? "You haven't published any posts yet. Share your thoughts with the world!"
                    : "No posts match your current filters."
                  }
                </p>
                {showMyPosts && (
                  <Button asChild className="gradient-button">
                    <Link href="/editor">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Post
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredPosts.map((post: Post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-6 mb-1">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.authorName || "Anonymous"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </div>
                          <Badge 
                            variant={post.published ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {post.published ? (
                              <>
                                <Globe className="h-3 w-3 mr-1" />
                                Published
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Draft
                              </>
                            )}
                          </Badge>
                        </CardDescription>
                      </div>
                      {showMyPosts && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/editor?id=${post.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            {!post.published && (
                              <DropdownMenuItem onClick={() => handlePublishPost(post.id)}>
                                <Globe className="h-4 w-4 mr-2" />
                                Publish
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div 
                      className="text-sm text-muted-foreground line-clamp-2 mb-3"
                      dangerouslySetInnerHTML={{ 
                        __html: post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...' 
                      }}
                    />
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/article/${post.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          Read
                        </Link>
                      </Button>
                      {showMyPosts && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/editor?id=${post.id}`}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
