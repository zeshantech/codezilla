"use client";

import { ProfileDashboard } from "@/components/profile/ProfileDashboard";
import { useInitializeUserProfile } from "@/store/useUserProfileStore";

export default function ProfilePage() {
  useInitializeUserProfile();

  return (
    <div className="container mx-auto flex-1 py-8">
      <ProfileDashboard />
    </div>
  );
}
