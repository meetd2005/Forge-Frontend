"use client"

import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { HomeFeed } from "@/components/home-feed"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state
  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  // Show feed if user is logged in
  if (user) {
    return <HomeFeed />
  }

  // Show landing page if not logged in
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <div className="navbar-enhanced">
        <Navbar />
      </div>

      {/* Hero Section */}
      <main className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
        {/* Enhanced Background Elements for Light Mode */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Light mode optimized floating shapes */}
          <div className="absolute top-20 left-16 w-32 h-32 bg-gradient-to-br from-emerald-200 to-green-300 dark:from-emerald-500/20 dark:to-green-500/20 rounded-full opacity-60 dark:opacity-40 animate-float blur-sm"></div>
          <div className="absolute top-40 right-24 w-24 h-24 bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-full opacity-50 dark:opacity-30 animate-float animate-delay-200 blur-sm"></div>
          <div className="absolute bottom-32 left-24 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-300 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full opacity-40 dark:opacity-25 animate-float animate-delay-400 blur-sm"></div>
          <div className="absolute bottom-20 right-32 w-28 h-28 bg-gradient-to-br from-orange-200 to-yellow-300 dark:from-orange-500/20 dark:to-yellow-500/20 rounded-full opacity-55 dark:opacity-35 animate-float animate-delay-600 blur-sm"></div>

          {/* Subtle geometric patterns */}
          <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" viewBox="0 0 1000 800">
            <defs>
              <linearGradient id="lightLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <g className="animate-pulse-slow">
              <path
                d="M100 200 Q300 100 500 200 T900 200"
                fill="none"
                stroke="url(#lightLineGradient)"
                strokeWidth="2"
                strokeDasharray="15,8"
              />
              <path
                d="M100 400 Q400 300 700 400 T900 400"
                fill="none"
                stroke="url(#lightLineGradient)"
                strokeWidth="1"
                strokeDasharray="8,8"
              />
            </g>
          </svg>
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
            {/* Left Content - Moved away from edge */}
            <div className="space-y-8 lg:pl-8 xl:pl-12">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-slate-900 dark:text-slate-100 leading-[0.95] animate-fade-in-up tracking-tight">
                  Where
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent animate-fade-in-up animate-delay-200 font-normal">
                    stories
                  </span>
                  <br />
                  <span className="text-slate-700 dark:text-slate-300 animate-fade-in-up animate-delay-400">
                    come alive
                  </span>
                </h1>
                <div className="max-w-lg">
                  <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed animate-fade-in-up animate-delay-600">
                    Discover powerful stories, compelling ideas, and diverse perspectives from writers around the world.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-800">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 dark:from-emerald-500 dark:to-green-500 dark:hover:from-emerald-600 dark:hover:to-green-600 text-white px-6 md:px-8 py-3 md:py-4 text-base rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border-0"
                >
                  <Link href="/signup">Start writing</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-6 md:px-8 py-3 md:py-4 text-base rounded-full transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/login">Start reading</Link>
                </Button>
              </div>

              {/* Enhanced Feature Highlights */}
              <div className="pt-8 space-y-4 animate-fade-in-up animate-delay-1000">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Trusted by writers worldwide
                </p>
                <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Premium writing tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Global community</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Monetize your content</span>
                  </div>
                </div>
              </div>

              {/* Footer Links */}
              <div className="pt-6 animate-fade-in-up animate-delay-1000">
                <div className="flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
                  <Link
                    href="/about"
                    className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors hover:underline"
                  >
                    About
                  </Link>
                  <Link
                    href="/help"
                    className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors hover:underline"
                  >
                    Help
                  </Link>
                  <Link
                    href="/careers"
                    className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors hover:underline"
                  >
                    Careers
                  </Link>
                  <Link
                    href="/privacy"
                    className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors hover:underline"
                  >
                    Privacy
                  </Link>
                  <Link
                    href="/terms"
                    className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors hover:underline"
                  >
                    Terms
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Illustration - Enhanced for light mode */}
            <div className="relative hidden lg:block animate-fade-in-right lg:pr-8 xl:pr-12">
              <div className="relative w-full h-[500px] max-w-lg mx-auto">
                {/* Modern abstract illustration */}
                <div className="absolute inset-0">
                  {/* Main geometric shapes optimized for light mode */}
                  <div className="absolute top-8 right-8 w-72 h-72 bg-gradient-to-br from-emerald-400/80 via-green-500/70 to-teal-500/80 dark:from-emerald-500/60 dark:via-green-600/50 dark:to-teal-600/60 rounded-3xl rotate-12 animate-float shadow-2xl backdrop-blur-sm"></div>
                  <div className="absolute top-16 right-16 w-64 h-64 bg-gradient-to-br from-blue-400/70 via-indigo-500/60 to-purple-500/70 dark:from-blue-500/50 dark:via-indigo-600/40 dark:to-purple-600/50 rounded-3xl -rotate-6 animate-float animate-delay-200 shadow-xl backdrop-blur-sm"></div>
                  <div className="absolute bottom-12 right-4 w-80 h-48 bg-gradient-to-br from-orange-400/60 via-pink-500/50 to-red-500/60 dark:from-orange-500/40 dark:via-pink-600/30 dark:to-red-600/40 rounded-3xl rotate-3 animate-float animate-delay-400 shadow-lg backdrop-blur-sm"></div>

                  {/* Decorative elements */}
                  <div className="absolute top-20 left-8 w-16 h-16 bg-gradient-to-br from-yellow-400/80 to-orange-500/80 dark:from-yellow-500/60 dark:to-orange-600/60 rounded-2xl rotate-45 animate-float animate-delay-600 shadow-lg"></div>
                  <div className="absolute bottom-20 left-4 w-12 h-12 bg-gradient-to-br from-purple-400/80 to-pink-500/80 dark:from-purple-500/60 dark:to-pink-600/60 rounded-xl -rotate-12 animate-float animate-delay-800 shadow-md"></div>

                  {/* Abstract writing elements */}
                  <svg className="absolute top-32 left-12 w-24 h-24 text-slate-600/60 dark:text-slate-400/40 animate-pulse-slow" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="penGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M20 20 Q40 10 60 20 Q80 30 80 50 Q80 70 60 80 Q40 90 20 80 Q0 70 0 50 Q0 30 20 20"
                      fill="none"
                      stroke="url(#penGradient)"
                      strokeWidth="2"
                      strokeDasharray="8,4"
                    />
                  </svg>

                  {/* Floating text elements */}
                  <div className="absolute top-48 left-16 animate-float animate-delay-1000">
                    <div className="text-xs font-mono text-slate-500/80 dark:text-slate-400/60 bg-white/80 dark:bg-slate-800/80 px-3 py-2 rounded-lg shadow-sm backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50">
                      &lt;story&gt;
                    </div>
                  </div>
                  <div className="absolute bottom-32 left-20 animate-float animate-delay-1200">
                    <div className="text-xs font-mono text-slate-500/80 dark:text-slate-400/60 bg-white/80 dark:bg-slate-800/80 px-3 py-2 rounded-lg shadow-sm backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50">
                      ideas.map()
                    </div>
                  </div>

                  {/* Subtle grid pattern */}
                  <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10" viewBox="0 0 400 500">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" className="text-slate-400 dark:text-slate-600" />
                  </svg>

                  {/* Animated sparkles */}
                  <div className="absolute top-12 left-20 w-2 h-2 bg-yellow-400 dark:bg-yellow-300 rounded-full animate-ping"></div>
                  <div className="absolute top-40 left-8 w-1.5 h-1.5 bg-blue-400 dark:bg-blue-300 rounded-full animate-ping animate-delay-200"></div>
                  <div className="absolute bottom-40 left-24 w-2 h-2 bg-emerald-400 dark:bg-emerald-300 rounded-full animate-ping animate-delay-400"></div>
                  <div className="absolute bottom-16 left-12 w-1.5 h-1.5 bg-purple-400 dark:bg-purple-300 rounded-full animate-ping animate-delay-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
