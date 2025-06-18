"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileSkills } from "./ProfileSkills";
import { ProfileSubmissionGraph } from "./ProfileSubmissionGraph";
import { ProfileSettings } from "./ProfileSettings";
import { ProfileCertificates } from "./ProfileCertificates";
import { ProfileLanguages } from "./ProfileLanguages";
import { ProfileBadges } from "./ProfileBadges";
import { ProfilePremium } from "./ProfilePremium";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfileStore } from "@/store/useUserProfileStore";
import { ProfileProgress } from "./ProfileProgress";

const VALID_TABS = ["overview", "skills", "languages", "badges", "activity", "certificates", "problems", "settings", "premium"];

export function ProfileDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const isProfileLoading = useUserProfileStore((state) => state.isLoadingGetProfile);

  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam)) {
      router.replace(`?tab=${tabParam}`);
    } else if (!tabParam) {
      router.replace(`?tab=overview`);
    }
  }, [tabParam]);

  if (isProfileLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-8">
      <ProfileHeader />

      <Tabs defaultValue="overview" value={tabParam || "overview"} onValueChange={(value) => router.replace(`?tab=${value}`)} className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ProfileProgress />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileSubmissionGraph isOverview />
            <ProfileSkills isOverview />
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <ProfileSkills />
        </TabsContent>

        <TabsContent value="languages">
          <ProfileLanguages />
        </TabsContent>

        <TabsContent value="badges">
          <ProfileBadges />
        </TabsContent>

        <TabsContent value="activity">
          <ProfileSubmissionGraph />
        </TabsContent>

        <TabsContent value="certificates">
          <ProfileCertificates />
        </TabsContent>

        <TabsContent value="settings">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="premium">
          <ProfilePremium />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-card rounded-lg border">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
          <div className="flex flex-wrap gap-2 mt-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>

      <Skeleton className="h-10 w-full max-w-4xl mx-auto" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    </div>
  );
}
