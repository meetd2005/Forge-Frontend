"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { statusCardVariants } from "@/components/ui/status-card"
import { cn } from "@/lib/utils"

export interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  icon: React.ReactNode
  variant?: "success" | "warning" | "error" | "info" | "default"
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel?: () => void
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  loading?: boolean
}

const ConfirmationDialog = React.forwardRef<
  React.ElementRef<typeof Dialog>,
  ConfirmationDialogProps
>(({
  open,
  onOpenChange,
  title,
  description,
  icon,
  variant = "default",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  confirmVariant = "default",
  loading = false,
  ...props
}, ref) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onOpenChange(false)
    }
  }

  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={cn(
              statusCardVariants({ variant }),
              "w-12 h-12" // Smaller than full page version
            )}>
              {React.cloneElement(icon as React.ReactElement, {
                className: cn("text-white w-6 h-6", (icon as React.ReactElement)?.props?.className)
              })}
            </div>
          </div>
          <DialogTitle className="text-xl font-serif text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 mt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "w-full sm:w-auto",
              variant === "success" && confirmVariant === "default" && 
              "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
            )}
          >
            {loading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
})
ConfirmationDialog.displayName = "ConfirmationDialog"

export { ConfirmationDialog }
