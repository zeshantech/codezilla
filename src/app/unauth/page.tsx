"use client";

import React from "react";
import { LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function page() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <LockIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Authentication Required</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>You need to be logged in to access this page. Please sign in to continue.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/auth/login")} className="w-full" size="lg">
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
