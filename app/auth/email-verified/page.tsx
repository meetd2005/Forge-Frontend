"use client"

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function EmailVerifiedPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="page-container min-h-screen flex items-center justify-center px-4">
      <Card className="enhanced-card w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-white w-10 h-10" />
          </div>
          <CardTitle className="text-2xl font-serif text-foreground">
            Email Verified
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your email has been successfully verified. Redirecting to your dashboard...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          Thank you for verifying your email address! You will be redirected shortly.
        </CardContent>
      </Card>
    </div>
  );
}

