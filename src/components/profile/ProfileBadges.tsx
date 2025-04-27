"use client";

import { UserBadge } from "@/types/profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Lock } from "lucide-react";

interface ProfileBadgesProps {
  badges: UserBadge[];
}

export function ProfileBadges({ badges }: ProfileBadgesProps) {
  const [activeTab, setActiveTab] = useState<
    "all" | "bronze" | "silver" | "gold" | "platinum"
  >("all");

  const filteredBadges =
    activeTab === "all"
      ? badges
      : badges.filter((badge) => badge.level === activeTab);

  const badgeCounts = {
    bronze: badges.filter((badge) => badge.level === "bronze").length,
    silver: badges.filter((badge) => badge.level === "silver").length,
    gold: badges.filter((badge) => badge.level === "gold").length,
    platinum: badges.filter((badge) => badge.level === "platinum").length,
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get badge level color
  const getBadgeLevelColor = (level: string) => {
    switch (level) {
      case "bronze":
        return "bg-amber-700 text-white";
      case "silver":
        return "bg-gray-400 text-white";
      case "gold":
        return "bg-yellow-500 text-white";
      case "platinum":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Badges</CardTitle>
          <CardDescription>
            Badges earned through your achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All{" "}
                <Badge variant="outline" className="ml-1">
                  {badges.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="bronze">
                Bronze{" "}
                <Badge variant="outline" className="ml-1">
                  {badgeCounts.bronze}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="silver">
                Silver{" "}
                <Badge variant="outline" className="ml-1">
                  {badgeCounts.silver}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="gold">
                Gold{" "}
                <Badge variant="outline" className="ml-1">
                  {badgeCounts.gold}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="platinum">
                Platinum{" "}
                <Badge variant="outline" className="ml-1">
                  {badgeCounts.platinum}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredBadges.length ? (
                  filteredBadges.map((badge) => (
                    <Card key={badge.id} className="overflow-hidden pt-0">
                      <div className="relative">
                        <div className="flex items-center justify-center bg-muted p-4 h-40">
                          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background flex items-center justify-center">
                            <img
                              src={badge.imageUrl || `/badges/placeholder.svg`}
                              alt={badge.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/badges/placeholder.svg";
                              }}
                            />
                          </div>
                        </div>
                        <Badge
                          className={`absolute top-2 right-2 capitalize ${getBadgeLevelColor(
                            badge.level
                          )}`}
                        >
                          {badge.level}
                        </Badge>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{badge.name}</CardTitle>
                        <CardDescription>{badge.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="text-xs text-muted-foreground border-t pt-2">
                        Earned on {formatDate(badge.earnedAt)}
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-3">
                      <Lock />
                    </div>
                    <h3 className="font-medium mb-1">No badges yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Solve more problems to earn{" "}
                      {activeTab !== "all" ? activeTab : ""} badges
                    </p>
                    <Button variant="outline" size="sm">
                      View available badges
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
