"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { StatusCard } from "@/components/ui/status-card"
import { User, Settings, Home } from "lucide-react"

export default function ProfileUpdatedPage() {
  const router = useRouter()

  return (
    <StatusCard
      variant="success"
      icon={<User />}
      title="Profile Updated"
      description="Your profile information has been successfully updated."
      content={
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Your changes are now live and visible to other users.
          </p>
        </div>
      }
      primaryAction={{
        label: "View Profile",
        onClick: () => router.push("/profile"),
        icon: <User />
      }}
      secondaryAction={{
        label: "Go Home",
        onClick: () => router.push("/"),
        variant: "outline",
        icon: <Home />
      }}
    />
  )
}
