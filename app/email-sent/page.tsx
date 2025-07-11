"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { StatusCard } from "@/components/ui/status-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function EmailSentRefactoredPage() {
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [error, setError] = useState("")
  const { resendVerificationEmail } = useAuth()

  const handleResend = async () => {
    setResendLoading(true)
    setError("")
    setResendSuccess(false)

    try {
      await resendVerificationEmail()
      setResendSuccess(true)
      toast({
        title: "Email sent!",
        description: "Verification email has been resent successfully.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resend email. Please try again."
      setError(errorMessage)
      toast({
        title: "Resend failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setResendLoading(false)
    }
  }

  const openEmailClient = () => {
    // Try to open common email clients
    window.location.href = "mailto:"
  }

  return (
    <StatusCard
      variant="info"
      icon={<Mail />}
      title="Check your email"
      description="We've sent you a verification link. Click the link in the email to verify your account."
      content={
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resendSuccess && (
            <Alert>
              <AlertDescription>Verification email has been resent successfully!</AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Didn't receive the email? Check your spam folder or request a new one.
            </p>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already verified?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      }
      primaryAction={{
        label: "Open Email App",
        onClick: openEmailClient,
        icon: <Mail />
      }}
      secondaryAction={{
        label: resendLoading ? "Sending..." : "Resend Email",
        onClick: handleResend,
        variant: "outline",
        icon: resendLoading ? <Loader2 className="animate-spin" /> : <RefreshCw />
      }}
    />
  )
}
