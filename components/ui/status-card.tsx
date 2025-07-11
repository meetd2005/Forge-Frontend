"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statusCardVariants = cva(
  "w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg",
  {
    variants: {
      variant: {
        success: "bg-gradient-to-br from-emerald-500 to-green-600",
        warning: "bg-gradient-to-br from-amber-500 to-orange-600",
        error: "bg-gradient-to-br from-red-500 to-rose-600",
        info: "bg-gradient-to-br from-blue-500 to-indigo-600",
        default: "bg-gradient-to-br from-slate-500 to-gray-600",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
)

export interface StatusCardAction {
  label: string
  onClick?: () => void
  href?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  icon?: React.ReactNode
}

export interface StatusCardProps extends VariantProps<typeof statusCardVariants> {
  icon: React.ReactNode
  title: string
  description: string
  content?: React.ReactNode
  primaryAction?: StatusCardAction
  secondaryAction?: StatusCardAction
  className?: string
}

const StatusCard = React.forwardRef<HTMLDivElement, StatusCardProps>(
  ({ 
    variant, 
    icon, 
    title, 
    description, 
    content, 
    primaryAction, 
    secondaryAction, 
    className,
    ...props 
  }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn("page-container min-h-screen flex items-center justify-center px-4", className)}
        {...props}
      >
        <Card className="enhanced-card w-full max-w-md">
          <CardHeader className="text-center">
            <div className={statusCardVariants({ variant })}>
              {React.cloneElement(icon as React.ReactElement, {
                className: cn("text-white w-8 h-8", (icon as React.ReactElement)?.props?.className)
              })}
            </div>
            <CardTitle className="text-2xl font-serif text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          </CardHeader>
          
          {(content || primaryAction || secondaryAction) && (
            <CardContent className="space-y-4">
              {content && content}
              
              {primaryAction && (
                <Button
                  variant={primaryAction.variant || "default"}
                  onClick={primaryAction.onClick}
                  className={cn(
                    "w-full",
                    variant === "success" && !primaryAction.variant && 
                    "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                  )}
                  {...(primaryAction.href && { asChild: true })}
                >
                  {primaryAction.href ? (
                    <a href={primaryAction.href}>
                      {primaryAction.icon && (
                        <span className="mr-2 h-4 w-4 flex items-center">
                          {primaryAction.icon}
                        </span>
                      )}
                      {primaryAction.label}
                    </a>
                  ) : (
                    <>
                      {primaryAction.icon && (
                        <span className="mr-2 h-4 w-4 flex items-center">
                          {primaryAction.icon}
                        </span>
                      )}
                      {primaryAction.label}
                    </>
                  )}
                </Button>
              )}
              
              {secondaryAction && (
                <Button
                  variant={secondaryAction.variant || "outline"}
                  onClick={secondaryAction.onClick}
                  className="w-full"
                  {...(secondaryAction.href && { asChild: true })}
                >
                  {secondaryAction.href ? (
                    <a href={secondaryAction.href}>
                      {secondaryAction.icon && (
                        <span className="mr-2 h-4 w-4 flex items-center">
                          {secondaryAction.icon}
                        </span>
                      )}
                      {secondaryAction.label}
                    </a>
                  ) : (
                    <>
                      {secondaryAction.icon && (
                        <span className="mr-2 h-4 w-4 flex items-center">
                          {secondaryAction.icon}
                        </span>
                      )}
                      {secondaryAction.label}
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    )
  }
)
StatusCard.displayName = "StatusCard"

export { StatusCard, statusCardVariants }
