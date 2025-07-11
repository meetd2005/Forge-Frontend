"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Home, RefreshCw, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function MaintenancePage() {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    // Set maintenance end time (example: 2 hours from now)
    const maintenanceEnd = new Date(Date.now() + 2 * 60 * 60 * 1000)

    const updateTimer = () => {
      const now = new Date()
      const difference = maintenanceEnd.getTime() - now.getTime()

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${hours}h ${minutes}m`)
      } else {
        setTimeLeft("Soon")
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="page-container min-h-screen flex items-center justify-center px-4">
      <Card className="enhanced-card w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg error-icon-shadow">
            <Wrench className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-serif text-foreground">
            Under Maintenance
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            We're currently performing scheduled maintenance to improve your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="warning-message-container rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Estimated completion time</p>
            </div>
            <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200">{timeLeft}</p>
          </div>

          <div className="info-message-container rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
              <strong>What's happening?</strong>
            </p>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Upgrading our servers for better performance</li>
              <li>• Installing security updates</li>
              <li>• Optimizing database performance</li>
              <li>• Adding new features</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <Button onClick={() => window.location.reload()} className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white error-page-button">
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Again
            </Button>

            <Button variant="outline" asChild className="w-full error-page-button">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Link>
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Stay updated</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/status">Status Page</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/twitter">Twitter</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/help">Help</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
