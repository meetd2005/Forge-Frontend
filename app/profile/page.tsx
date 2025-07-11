"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { ArticleCard } from "@/components/article-card"
import { ArticleCardSkeleton } from "@/components/skeleton-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UserAvatar } from "@/components/user-avatar"
import { AvatarUpload } from "@/components/avatar-upload"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { API_CONFIG } from "@/lib/api-config"
import { useToast } from "@/hooks/use-toast"
import { Edit, BookOpen, PenTool } from "lucide-react"

// Mock data - replace with API calls
const mockUserArticles = [
  {
    id: "1",
    title: "My Journey into Web Development",
    excerpt: "How I transitioned from a different career into tech and what I learned along the way.",
    content: "",
    coverImage: "/placeholder.svg?height=300&width=600",
    author: {
      id: "1",
      name: "Current User",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["Career", "Web Development", "Personal"],
    likes: 45,
    comments: 8,
    createdAt: "2024-01-10T10:00:00Z",
    readTime: 5,
  },
]

const mockBookmarkedArticles = [
  {
    id: "2",
    title: "Advanced React Patterns You Should Know",
    excerpt: "Exploring compound components, render props, and other advanced React patterns.",
    content: "",
    coverImage: "/placeholder.svg?height=300&width=600",
    author: {
      id: "2",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["React", "JavaScript", "Patterns"],
    likes: 89,
    comments: 12,
    createdAt: "2024-01-08T14:30:00Z",
    readTime: 10,
  },
]

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [userArticles, setUserArticles] = useState(mockUserArticles)
  const [bookmarkedArticles, setBookmarkedArticles] = useState(mockBookmarkedArticles)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    avatar: "",
  })

  // Update profile data when user changes or dialog opens
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      })
    }
  }, [user])

  // Reset profile data when dialog opens
  const handleEditProfileOpen = (open: boolean) => {
    if (open && user) {
      setProfileData({
        name: user.name || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      })
    }
    setEditingProfile(open)
  }

  const fetchUserData = async () => {
    setLoading(true)
    try {
      // Replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Fetch user articles and bookmarks
    } catch (error) {
      console.error("Failed to fetch user data:", error)
      toast({
        title: "Error loading profile",
        description: "Failed to load your profile data. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const updateProfile = async () => {
    if (!profileData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name before saving.",
        variant: "destructive",
      })
      return
    }

    try {
      // Clear any old localStorage tokens first
      if (typeof window !== 'undefined') {
        const oldTokens = ['forge_token', 'token', 'access_token', 'refresh_token']
        oldTokens.forEach(key => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key)
            console.log(`Removed old token: ${key}`)
          }
        })
      }

      
      // Call the actual API endpoint
      const response = await fetch(`${API_CONFIG.REST_BASE_URL.users}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Use cookies for auth
        body: JSON.stringify({
          name: profileData.name,
          bio: profileData.bio
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized - please log in again")
        } else if (response.status === 400) {
          throw new Error(data.detail || data.message || "Invalid profile data")
        } else {
          throw new Error(data.detail || data.message || "Failed to update profile")
        }
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to update profile")
      }

      // Update the user context with new data
      await refreshUser()

      toast({
        title: "Profile updated successfully",
        description: "Your profile changes have been saved.",
      })

      handleEditProfileOpen(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile"

      toast({
        title: "Error updating profile",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="page-container min-h-screen">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          {/* Profile Header */}
          <Card className="enhanced-card mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <UserAvatar user={user || { name: "User", avatar: null }} size="xl" />

                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{user?.name}</h1>
                  <p className="text-muted-foreground mb-4">{user?.bio || "No bio added yet."}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{userArticles.length} articles</span>
                    <span>{bookmarkedArticles.length} bookmarks</span>
                    <span>Joined {new Date(user?.createdAt || "").toLocaleDateString()}</span>
                  </div>
                </div>

                <Dialog open={editingProfile} onOpenChange={handleEditProfileOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <AvatarUpload
                          currentAvatar={profileData.avatar}
                          userName={profileData.name}
                          onAvatarChange={(avatarUrl) => setProfileData((prev) => ({ ...prev, avatar: avatarUrl }))}
                          size="lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself..."
                          value={profileData.bio}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => handleEditProfileOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={updateProfile}>Save Changes</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="articles" className="flex items-center">
                <PenTool className="h-4 w-4 mr-2" />
                My Articles
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Bookmarks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-6">
              {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ArticleCardSkeleton key={i} />
                  ))}
                </div>
              ) : userArticles.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {userArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} showBookmark={false} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <PenTool className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start writing your first article to share your thoughts with the world.
                    </p>
                    <Button asChild>
                      <a href="/editor">Write Your First Article</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="bookmarks" className="space-y-6">
              {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
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
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Bookmark articles you want to read later or reference again.
                    </p>
                    <Button variant="outline" asChild>
                      <a href="/">Discover Articles</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
