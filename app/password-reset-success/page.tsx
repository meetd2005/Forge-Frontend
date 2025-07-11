"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { StatusCard } from "@/components/ui/status-card"
import { Shield, LogIn } from "lucide-react"

export default function PasswordResetSuccessPage() {
  const router = useRouter()

  return (
    <StatusCard
      variant="success"
      icon={<Shield />}
      title="Password Reset Complete"
      description="Your password has been successfully updated. You can now sign in with your new password."
      content={
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            For your security, you'll need to sign in again with your new password.
          </p>
        </div>
      }
      primaryAction={{
        label: "Sign In",
        onClick: () => router.push("/login"),
        icon: <LogIn />
      }}
    />
  )
}
