"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, EditIcon } from "lucide-react";
import { useUserProfileStore } from "@/store/useUserProfileStore";
import dayjs from "dayjs";
import { getInitials } from "@/lib/utils";

export function ProfileHeader() {
  const profile = useUserProfileStore((state) => state.profile);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-card rounded-lg border">
      <Avatar className="h-24 w-24">
        <AvatarImage src={profile?.avatarUrl} alt={profile?.firstName} />
        <AvatarFallback>{getInitials(profile?.firstName + " " + profile?.lastName)}</AvatarFallback>
      </Avatar>

      <div className="space-y-1.5 flex-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold">
          {profile?.firstName} {profile?.lastName}
        </h2>
        <p className="text-muted-foreground">{profile?.bio || "No bio provided"}</p>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
          <div className="text-sm flex items-center gap-1 text-muted-foreground">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Joined {dayjs(profile?.createdAt).format("DD MMM YYYY")}</span>
          </div>
          <div className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">{profile?.completedProblems} problems solved</div>
          <div className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">{profile?.streak} day streak</div>
          <div className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">{profile?.points} points</div>
        </div>
      </div>

      <div className="mt-4 sm:mt-0">
        <Button variant="outline" size="sm">
          <EditIcon className="h-4 w-4 mr-1" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
