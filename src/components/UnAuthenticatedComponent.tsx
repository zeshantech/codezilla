import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { LockIcon } from "lucide-react";

export default function UnAuthenticatedComponent() {
  const { login } = useAuth();

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
          <Button onClick={() => login(window.location.href)} className="w-full" size="lg">
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
