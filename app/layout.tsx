import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { ApolloWrapper } from "@/components/apollo-wrapper"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Forge - Premium Writing Platform",
  description: "A premium Medium-style content platform where everyone is a creator",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ApolloWrapper>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </ApolloWrapper>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
