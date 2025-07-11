/**
 * Status Card and Confirmation Dialog Examples
 * 
 * This file demonstrates how to use the StatusCard and ConfirmationDialog components
 * with the existing design tokens to maintain UX consistency.
 */

"use client"

import React, { useState } from "react"
import { StatusCard } from "@/components/ui/status-card"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Trash2,
  Save,
  Mail,
  Shield,
  User,
  FileText,
  Crown
} from "lucide-react"

// Example: Using StatusCard for full-page success
export function ExampleSuccessPage() {
  return (
    <StatusCard
      variant="success"
      icon={<CheckCircle2 />}
      title="Operation Successful"
      description="Your action has been completed successfully."
      primaryAction={{
        label: "Continue",
        onClick: () => console.log("Continue clicked"),
        icon: <CheckCircle2 />
      }}
      secondaryAction={{
        label: "Go Back",
        onClick: () => console.log("Go back clicked"),
        variant: "outline"
      }}
    />
  )
}

// Example: Using StatusCard for warnings
export function ExampleWarningPage() {
  return (
    <StatusCard
      variant="warning"
      icon={<AlertTriangle />}
      title="Action Required"
      description="Please review the following information before proceeding."
      content={
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            This action may affect other parts of your account.
          </p>
        </div>
      }
      primaryAction={{
        label: "Review Settings",
        onClick: () => console.log("Review clicked")
      }}
    />
  )
}

// Example: Using StatusCard for errors
export function ExampleErrorPage() {
  return (
    <StatusCard
      variant="error"
      icon={<XCircle />}
      title="Something Went Wrong"
      description="We encountered an error while processing your request."
      primaryAction={{
        label: "Try Again",
        onClick: () => console.log("Try again clicked"),
        variant: "destructive"
      }}
      secondaryAction={{
        label: "Contact Support",
        onClick: () => console.log("Contact support clicked"),
        variant: "outline"
      }}
    />
  )
}

// Example: Using ConfirmationDialog for inline confirmations
export function ExampleConfirmationDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    setOpen(false)
    console.log("Confirmed!")
  }

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>
        Delete Item
      </Button>
      
      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        variant="error"
        icon={<Trash2 />}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={handleConfirm}
        loading={loading}
      />
    </div>
  )
}

// Example: Router navigation patterns
export function ExampleNavigationPatterns() {
  // This would typically be in a page component with useRouter
  const mockRouter = {
    push: (path: string) => console.log(`Navigate to: ${path}`),
    back: () => console.log("Go back")
  }

  // Redirect after successful action
  const handlePublishArticle = () => {
    // After successful API call:
    mockRouter.push("/article-published?id=123&title=My Article")
  }

  // Redirect with custom parameters
  const handleGenericSuccess = () => {
    const params = new URLSearchParams({
      title: "Custom Success!",
      message: "Your custom action was completed.",
      returnUrl: "/dashboard",
      returnLabel: "Go to Dashboard"
    })
    mockRouter.push(`/success?${params.toString()}`)
  }

  return (
    <div className="p-4 space-y-4">
      <Button onClick={handlePublishArticle}>
        Publish Article (redirect to status page)
      </Button>
      <Button onClick={handleGenericSuccess}>
        Custom Success (with parameters)
      </Button>
    </div>
  )
}

// Example: Status card with rich content
export function ExampleRichContentStatus() {
  return (
    <StatusCard
      variant="success"
      icon={<Crown />}
      title="Premium Activated"
      description="Welcome to your premium subscription!"
      content={
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">What's included:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
                Unlimited articles
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
                Advanced analytics
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
                Priority support
              </li>
            </ul>
          </div>
        </div>
      }
      primaryAction={{
        label: "Explore Features",
        onClick: () => console.log("Explore clicked")
      }}
    />
  )
}

export default {
  ExampleSuccessPage,
  ExampleWarningPage,
  ExampleErrorPage,
  ExampleConfirmationDialog,
  ExampleNavigationPatterns,
  ExampleRichContentStatus
}
