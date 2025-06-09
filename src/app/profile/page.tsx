"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { ProfileDashboard } from "@/components/profile/ProfileDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { token } = useAuth();

  console.log(token, "token");

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <AppHeader />

        <main className="flex-1 py-8">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
            <ProfileDashboard />
          </div>
        </main>

        <AppFooter />
      </div>
    </ProtectedRoute>
  );
}
