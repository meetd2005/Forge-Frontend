"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@apollo/client"
import { ProtectedRoute } from "@/components/protected-route"
import { TiptapEditor } from "@/components/tiptap-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { CREATE_POST } from "@/lib/graphql/posts"
import type { CreatePostInput } from "@/lib/graphql/posts"
import { ArrowLeft, Save, Send, ImageIcon, X, Eye, User } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"

export default function EditorPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  // GraphQL mutation for creating posts
  const [createPost, { loading: createPostLoading }] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      if (data.createPost.success) {
        toast({
          title: data.createPost.message,
          description: data.createPost.post?.published 
            ? "Your article is now live and visible to all readers!"
            : "Your article has been saved as a draft and can be accessed later.",
        })
        
        if (data.createPost.post?.published) {
          router.push("/")
        }
      } else {
        toast({
          title: "Failed to save post",
          description: data.createPost.message,
          variant: "destructive",
        })
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to save post",
        description: error.message || "Unable to save your post. Please check your connection and try again.",
        variant: "destructive",
      })
    }
  })

  const addTag = () => {
    if (!tagInput.trim()) {
      toast({
        title: "Empty tag",
        description: "Please enter a tag name.",
        variant: "destructive",
      })
      return
    }

    if (tags.includes(tagInput.trim())) {
      toast({
        title: "Duplicate tag",
        description: "This tag has already been added.",
        variant: "destructive",
      })
      return
    }

    if (tags.length >= 5) {
      toast({
        title: "Maximum tags reached",
        description: "You can only add up to 5 tags per article.",
        variant: "destructive",
      })
      return
    }

    if (tagInput.trim().length < 2) {
      toast({
        title: "Tag too short",
        description: "Tags must be at least 2 characters long.",
        variant: "destructive",
      })
      return
    }

    setTags([...tags, tagInput.trim()])
    setTagInput("")

    toast({
      title: "Tag added",
      description: `"${tagInput.trim()}" has been added to your article.`,
    })
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const saveDraft = async () => {
    if (!title.trim() && !content.trim()) {
      toast({
        title: "Nothing to save",
        description: "Please add some content before saving a draft.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      if (!user?.id) {
        toast({
          title: "Authentication required",
          description: "Please log in to save posts.",
          variant: "destructive",
        })
        return
      }

      const postInput: CreatePostInput = {
        title: title.trim() || "Untitled Draft",
        content: content.trim() || "Draft content...",
        authorId: user.id,
        tags: tags,
        published: false
      }

      await createPost({
        variables: { input: postInput }
      })
    } catch (error) {
      // Error is handled by onError callback
    } finally {
      setSaving(false)
    }
  }

  const publishArticle = async () => {
    // Validation
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title to your article before publishing.",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content to your article before publishing.",
        variant: "destructive",
      })
      return
    }

    if (title.length < 10) {
      toast({
        title: "Title too short",
        description: "Please make your title at least 10 characters long.",
        variant: "destructive",
      })
      return
    }

    if (content.length < 100) {
      toast({
        title: "Content too short",
        description: "Please write at least 100 characters of content.",
        variant: "destructive",
      })
      return
    }

    setPublishing(true)
    try {
      if (!user?.id) {
        toast({
          title: "Authentication required",
          description: "Please log in to publish posts.",
          variant: "destructive",
        })
        return
      }

      const postInput: CreatePostInput = {
        title: title.trim(),
        content: content.trim(),
        authorId: user.id,
        tags: tags,
        published: true
      }

      await createPost({
        variables: { input: postInput }
      })
    } catch (error) {
      // Error is handled by onError callback
    } finally {
      setPublishing(false)
    }
  }

  const uploadCoverImage = async (file: File) => {
    setUploadingCover(true)
    
    try {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file (JPG, PNG, GIF, WebP)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      // For now, use the avatar upload endpoint (we can create a dedicated endpoint later)
      const formData = new FormData()
      formData.append('file', file)

      // Upload to backend using avatar endpoint (temporary solution)
      const response = await fetch(API_CONFIG.UPLOADS.AVATAR, {
        method: 'POST',
        credentials: 'include', // Use cookies for authentication
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Upload failed')
      }

      const result = await response.json()
      setCoverImage(result.avatar)
      
      toast({
        title: "Cover image uploaded",
        description: "Cover image has been successfully uploaded.",
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload cover image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingCover(false)
    }
  }

  const handleCoverImageClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        uploadCoverImage(file)
      }
    }
    input.click()
  }

  return (
    <ProtectedRoute>
      <div className="page-container min-h-screen">
        {/* Header */}
        <header className="navbar-enhanced sticky top-0 z-50 border-b backdrop-blur-xl">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover:bg-muted"
                >
                  <Link href="/">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
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
                      <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"></path>
                      <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"></path>
                      <path d="m2.3 2.3 7.286 7.286"></path>
                      <circle cx="11" cy="11" r="2"></circle>
                    </svg>
                  </div>
                  <span className="font-serif text-xl font-normal text-primary-light dark:text-primary-dark">
                    Draft
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="hidden md:flex btn-outline-light dark:btn-outline-dark"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? "Edit" : "Preview"}
                </Button>
                <Button
                  variant="outline"
                  onClick={saveDraft}
                  disabled={saving || createPostLoading}
                  size="sm"
                  className="btn-outline-light dark:btn-outline-dark bg-transparent"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving || createPostLoading ? "Saving..." : "Save"}
                </Button>
                <Button onClick={publishArticle} disabled={publishing || createPostLoading} size="sm" className="gradient-button">
                  <Send className="h-4 w-4 mr-2" />
                  {publishing || createPostLoading ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Cover Image Section */}
            <div className="enhanced-card rounded-xl overflow-hidden shadow-sm">
              {coverImage ? (
                <div className="relative group">
                  <Image
                    src={coverImage || "/placeholder.svg"}
                    alt="Cover"
                    width={800}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setCoverImage("")}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Cover
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleCoverImageClick}
                  disabled={uploadingCover}
                  className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-gray-50 dark:bg-gray-800/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ImageIcon className="h-12 w-12 mb-3" />
                  <span className="text-lg font-medium">
                    {uploadingCover ? "Uploading..." : "Add a cover image"}
                  </span>
                  <span className="text-sm">
                    {uploadingCover ? "Please wait..." : "Recommended: 1600 × 840"}
                  </span>
                </button>
              )}
            </div>

            {/* Title Input */}
            <div className="enhanced-card rounded-xl p-6 shadow-sm">
              <Input
                placeholder="Article title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl md:text-4xl font-bold border-none px-0 py-4 h-auto placeholder:text-muted-foreground focus-visible:ring-0 bg-transparent text-foreground"
              />
            </div>

            {/* Content Editor */}
            <div className="enhanced-card rounded-xl overflow-hidden shadow-sm">
              {showPreview ? (
                <div className="p-8">
                  <div
                    className="prose prose-lg max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: content || "<p>Start writing to see preview...</p>" }}
                  />
                </div>
              ) : (
                <TiptapEditor content={content} onChange={setContent} placeholder="Tell your story..." />
              )}
            </div>

            {/* Tags Section */}
            <div className="enhanced-card rounded-xl p-6 shadow-sm">
              <Label className="text-base font-medium text-foreground mb-4 block">
                Tags ({tags.length}/5)
              </Label>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="px-3 py-1 badge-light dark:badge-dark bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                    >
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-2 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={tags.length >= 5}
                  className="flex-1 input-light dark:input-dark bg-white/90 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-primary-light dark:text-primary-dark"
                />
                <Button
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 5}
                  size="default"
                  variant="outline"
                  className="px-6 btn-outline-light dark:btn-outline-dark"
                >
                  Add Tag
                </Button>
              </div>

              <p className="text-xs text-secondary-light dark:text-secondary-dark mt-3">
                Add up to 5 tags to help readers discover your article
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
