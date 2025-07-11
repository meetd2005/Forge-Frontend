"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { StatusCard } from "@/components/ui/status-card"
import { FileText, Eye, Share2, Edit } from "lucide-react"

export default function ArticlePublishedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const articleId = searchParams.get("id")
  const articleTitle = searchParams.get("title") || "Your Article"

  const handleViewArticle = () => {
    if (articleId) {
      router.push(`/article/${articleId}`)
    } else {
      router.push("/")
    }
  }

  const handleShareArticle = () => {
    if (articleId) {
      const url = `${window.location.origin}/article/${articleId}`
      navigator.clipboard.writeText(url)
      // You could show a toast here
    }
  }

  return (
    <StatusCard
      variant="success"
      icon={<FileText />}
      title="Article Published!"
      description={`"${articleTitle}" has been successfully published and is now live.`}
      content={
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Your article is now visible to readers. You can view it, share it, or continue writing.
          </p>
        </div>
      }
      primaryAction={{
        label: "View Article",
        onClick: handleViewArticle,
        icon: <Eye />
      }}
      secondaryAction={{
        label: "Share Article",
        onClick: handleShareArticle,
        variant: "outline",
        icon: <Share2 />
      }}
    />
  )
}
