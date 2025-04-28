"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, Code } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function UserMenu() {
  const auth = useAuth();
  const { authenticated, loading, profile } = auth;

  if (loading) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  if (!authenticated) {
    return (
      <Button size="sm" onClick={() => auth.login()}>
        Login
      </Button>
    );
  }

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }
    if (profile?.firstName) {
      return profile.firstName.substring(0, 2).toUpperCase();
    }
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={profile?.attributes.avatar || ""}
            alt={profile?.firstName || "User"}
          />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <span className="font-medium">
              {profile?.firstName} {profile?.lastName}
            </span>
            {profile?.username && (
              <span className="text-xs text-muted-foreground">
                @{profile?.username}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <Code />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => auth.logout()}
          className="text-error cursor-pointer"
        >
          <LogOut />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
