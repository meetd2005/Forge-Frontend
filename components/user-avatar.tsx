"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserInitials } from "@/lib/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  user: {
    name: string
    avatar?: string | null
  }
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm", 
    lg: "h-12 w-12 text-base",
    xl: "h-24 w-24 text-2xl"
  }

  const initials = getUserInitials(user.name)
  
  // Generate consistent background color based on user name
  const getInitialsColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500", 
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500"
    ]
    
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={user.avatar || undefined} alt={user.name} />
      <AvatarFallback className={cn("font-semibold text-white", getInitialsColor(user.name))}>
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
