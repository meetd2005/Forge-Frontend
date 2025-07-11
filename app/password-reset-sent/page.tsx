"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { StatusCard } from "@/components/ui/status-card"
import { Mail, ArrowLeft, RefreshCw } from "lucide-react"

export default function PasswordResetSentPage() {
  const router = useRouter()

  const handleResend = () => {
    // Navigate back to forgot password page
    router.push("/forgot-password")
  }

  return (
    <StatusCard
      variant="info"
      icon={<Mail />}
      title="Password Reset Email Sent"
      description="We've sent you a link to reset your password. Please check your email and follow the instructions."
      content={
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            The email should arrive within a few minutes. If you don't see it, check your spam folder.
          </p>
        </div>
      }
      primaryAction={{
        label: "Resend Email",
        onClick: handleResend,
        variant: "outline",
        icon: <RefreshCw />
      }}
      secondaryAction={{
        label: "Back to Login",
        onClick: () => router.push("/login"),
        variant: "outline",
        icon: <ArrowLeft />
      }}
    />
  )
}