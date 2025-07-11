"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { StatusCard } from "@/components/ui/status-card"
import { Crown, Sparkles, Home, Settings } from "lucide-react"

export default function SubscriptionConfirmedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const planName = searchParams.get("plan") || "Premium"

  return (
    <StatusCard
      variant="success"
      icon={<Crown />}
      title="Welcome to Premium!"
      description={`Your ${planName} subscription has been activated successfully. Enjoy all the premium features!`}
      content={
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="text-amber-500 h-5 w-5" />
            <p className="text-sm font-medium text-foreground">
              Premium features are now unlocked
            </p>
            <Sparkles className="text-amber-500 h-5 w-5" />
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Unlimited articles</li>
            <li>• Advanced editing tools</li>
            <li>• Priority support</li>
            <li>• Custom themes</li>
          </ul>
        </div>
      }
      primaryAction={{
        label: "Explore Premium Features",
        onClick: () => router.push("/dashboard"),
        icon: <Sparkles />
      }}
      secondaryAction={{
        label: "Manage Subscription",
        onClick: () => router.push("/settings/billing"),
        variant: "outline",
        icon: <Settings />
      }}
    />
  )
}
