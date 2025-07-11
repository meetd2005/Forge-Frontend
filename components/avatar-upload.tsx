"use client"

import { useState, useRef } from "react"
import { UserAvatar } from "@/components/user-avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { API_CONFIG } from "@/lib/api-config"
import { Upload, X } from "lucide-react"

interface AvatarUploadProps {
  currentAvatar?: string
  userName: string
  onAvatarChange: (avatarUrl: string) => void
  size?: "sm" | "md" | "lg"
}

export function AvatarUpload({ 
  currentAvatar, 
  userName, 
  onAvatarChange, 
  size = "md" 
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentAvatar || "")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { refreshUser } = useAuth()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, WebP)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Upload to backend
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(`${API_CONFIG.REST_BASE_URL.users}/upload-avatar`, {
        method: 'POST',
        body: formData,
        credentials: 'include' // Use cookies for auth
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || errorData.message || "Failed to upload avatar")
      }

      const data = await response.json()
      
      // Update preview and notify parent
      setPreviewUrl(data.avatar)
      onAvatarChange(data.avatar)
      
      // Refresh user context to update the avatar everywhere
      await refreshUser()

      toast({
        title: "Avatar updated successfully",
        description: "Your profile picture has been updated.",
      })

    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload avatar",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const clearAvatar = () => {
    setPreviewUrl("")
    onAvatarChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <UserAvatar 
          user={{ name: userName, avatar: previewUrl || null }} 
          size={size} 
        />

        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
            
            {previewUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAvatar}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground">
            JPG, PNG up to 5MB
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}