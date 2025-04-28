"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileProgress } from "./ProfileProgress";
import { ProfileSkills } from "./ProfileSkills";
import { ProfileSubmissionGraph } from "./ProfileSubmissionGraph";
import { ProfileSettings } from "./ProfileSettings";
import { ProfileCertificates } from "./ProfileCertificates";
import { ProfileLanguages } from "./ProfileLanguages";
import { ProfileBadges } from "./ProfileBadges";
import { ProfilePremium } from "./ProfilePremium";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const validTabs = [
    "overview",
    "skills",
    "languages",
    "badges",
    "activity",
    "certificates",
    "problems",
    "settings",
    "premium",
  ];

  const [activeTab, setActiveTab] = useState(
    validTabs.includes(tabParam || "") ? tabParam : "overview"
  );

  const {
    profile,
    isProfileLoading,
    getSkillStats,
    getProblemsByCategoryWithStatus,
    getActivityHistory,
    getLanguageStats,
    getBadges,
    getCertificates,
    updateProfile,
    updateSettings,
  } = useProfile();

  useEffect(() => {
    if (activeTab === "overview") {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("tab");
      router.replace(`?${newParams.toString()}`);
    } else {
      router.replace(`?tab=${activeTab}`);
    }
  }, [activeTab, router, searchParams]);

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (!tabParam) {
      setActiveTab("overview");
    }
  }, [tabParam]);

  if (isProfileLoading || !profile) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-8">
      <ProfileHeader />

      <Tabs
        defaultValue="overview"
        value={activeTab!}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
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
          <ProfileProgress
            user={profile}
            problemsByCategory={getProblemsByCategoryWithStatus()}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileSubmissionGraph activityHistory={getActivityHistory(14)} />
            <ProfileSkills skillStats={getSkillStats(5)} />
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <ProfileSkills skillStats={getSkillStats()} />
        </TabsContent>

        <TabsContent value="languages">
          <ProfileLanguages languageStats={getLanguageStats()} />
        </TabsContent>

        <TabsContent value="badges">
          <ProfileBadges badges={getBadges()} />
        </TabsContent>

        <TabsContent value="activity">
          <ProfileSubmissionGraph activityHistory={getActivityHistory(30)} />
        </TabsContent>

        <TabsContent value="certificates">
          <ProfileCertificates certificates={getCertificates()} />
        </TabsContent>

        <TabsContent value="settings">
          <ProfileSettings
            user={profile}
            settings={profile.settings}
            onUpdateProfile={updateProfile}
            onUpdateSettings={updateSettings}
          />
        </TabsContent>

        <TabsContent value="premium">
          <ProfilePremium user={profile} />
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
