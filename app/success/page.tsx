"use client"

import React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { StatusCard } from "@/components/ui/status-card"
import { CheckCircle2, Home, ArrowLeft } from "lucide-react"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const title = searchParams.get("title") || "Success!"
  const message = searchParams.get("message") || "Your action was completed successfully."
  const returnUrl = searchParams.get("returnUrl") || "/"
  const returnLabel = searchParams.get("returnLabel") || "Continue"

  return (
    <StatusCard
      variant="success"
      icon={<CheckCircle2 />}
      title={title}
      description={message}
      primaryAction={{
        label: returnLabel,
        onClick: () => router.push(returnUrl),
        icon: <Home />
      }}
      secondaryAction={{
        label: "Go Back",
        onClick: () => router.back(),
        variant: "outline",
        icon: <ArrowLeft />
      }}
    />
  )
}
