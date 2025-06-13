"use client";

import { ProfileDashboard } from "@/components/profile/ProfileDashboard";
import { useInitializeUserProfile } from "@/store/useUserProfileStore";

export default function ProfilePage() {
  useInitializeUserProfile();

  return (
    <main className="flex-1 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        <ProfileDashboard />
      </div>
    </main>
  );
}
