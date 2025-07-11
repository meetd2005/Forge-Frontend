"use client"

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState("loading"); // Start with loading state
  const [message, setMessage] = useState("");
  const hasAttemptedRef = useRef(false); // Persist across re-renders
  const { verifyEmail } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    // If already attempted, don't try again
    if (hasAttemptedRef.current) {
      return;
    }

    // Check token first
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification token.");
      return;
    }

    hasAttemptedRef.current = true; // Mark as attempted immediately
    
    const verify = async () => {
      try {
        // Add small delay to ensure loading state is visible
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await verifyEmail(token);
        
        setStatus("success");
        setMessage("Email verified successfully!");
        
        // Redirect to login page so user can sign in
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Verification failed.";
        
        // Check if it's an "already verified" case
        if (errorMessage.includes("already verified") || errorMessage.includes("already")) {
          setStatus("success");
          setMessage("Email already verified!");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(errorMessage);
        }
      }
    };

    verify();
  }, []); // Empty dependency array to run only once

  return (
    <div className="page-container min-h-screen flex items-center justify-center px-4">
      <Card className="enhanced-card w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"></path>
              <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"></path>
              <path d="m2.3 2.3 7.286 7.286"></path>
              <circle cx="11" cy="11" r="2"></circle>
            </svg>
          </div>
          <CardTitle className="text-2xl font-serif text-foreground">
            {status === "loading" && "Verifying Your Email"}
            {status === "success" && "Email Verified Successfully!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {status === "loading" && "Please wait while we verify your email address..."}
            {status === "error" && "There was an issue verifying your email"}
            {status === "success" && "Your email has been verified successfully"}
          </CardDescription>
        </CardHeader>
        {status === "error" && (
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </CardContent>
        )}
        {status === "loading" && (
          <CardContent className="flex justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </CardContent>
        )}
        {status === "success" && (
          <CardContent className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-white w-10 h-10" />
            </div>
            <p className="text-sm text-muted-foreground">
              Redirecting to sign in page...
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

