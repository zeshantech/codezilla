"use client";

import { UserProfile } from "@/types/profile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, EditIcon } from "lucide-react";

interface ProfileHeaderProps {
  user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-card rounded-lg border">
      <Avatar className="h-24 w-24">
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>

      <div className="space-y-1.5 flex-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-muted-foreground">{user.bio || "No bio provided"}</p>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
          <div className="text-sm flex items-center gap-1 text-muted-foreground">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Joined {formatDate(user.joinedDate)}</span>
          </div>
          <div className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {user.completedProblems} problems solved
          </div>
          <div className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {user.streak} day streak
          </div>
          <div className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {user.points} points
          </div>
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
