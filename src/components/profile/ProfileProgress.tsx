"use client";

import { IGetProfileOutput } from "@/types/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Code, ListFilter } from "lucide-react";
import { useUserProfileStore } from "@/store/useUserProfileStore";
import { useEffect, useMemo } from "react";

export function ProfileProgress() {
  const difficultyStats = useUserProfileStore((state) => state.difficultyStats);
  const profile = useUserProfileStore((state) => state.profile);

  const solvedPercentage = useMemo(() => {
    if (!difficultyStats) return { easy: 0, medium: 0, hard: 0 };

    const easySolved = difficultyStats?.easy?.solved || 0;
    const mediumSolved = difficultyStats?.medium?.solved || 0;
    const hardSolved = difficultyStats?.hard?.solved || 0;

    const easyTotal = difficultyStats?.easy?.total || 0;
    const mediumTotal = difficultyStats?.medium?.total || 0;
    const hardTotal = difficultyStats?.hard?.total || 0;

    return { easy: (easySolved / easyTotal) * 100, medium: (mediumSolved / mediumTotal) * 100, hard: (hardSolved / hardTotal) * 100 };
  }, [difficultyStats]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center text-base">
            Overall Progress
            <Badge variant="outline" className="ml-2">
              {solvedPercentage}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Solved
                </span>
                <span>
                  {totalSolved} / {totalProblems}
                </span>
              </div>
              <Progress value={solvedPercentage} />
            </div>
          </div>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">By Difficulty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-success flex items-center gap-2">
                  <div className="p-1.5 bg-success rounded" /> Easy
                </span>
                <span>
                  {difficultyStats?.easy.solved} / {difficultyStats?.easy.total}
                </span>
              </div>
              <Progress value={solvedPercentage.easy} className="bg-success/20" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-warning flex items-center gap-2">
                  <div className="p-1.5 bg-warning rounded" /> Medium
                </span>
                <span>
                  {difficultyStats?.medium.solved} / {difficultyStats?.medium.total}
                </span>
              </div>
              <Progress value={solvedPercentage.medium} className="bg-warning/20" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-error flex items-center gap-2">
                  <div className="p-1.5 bg-error rounded" /> Hard
                </span>
                <span>
                  {difficultyStats?.hard.solved} / {difficultyStats?.hard.total}
                </span>
              </div>
              <Progress value={solvedPercentage.hard} className="bg-error/20" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">User Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Code className="h-4 w-4" /> Problems Completed
              </span>
              <span className="font-medium">{profile?.completedProblems}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <ListFilter className="h-4 w-4" /> Collections Completed
              </span>
              <span className="font-medium">{profile?.completedCollections}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" /> Current Streak
              </span>
              <span className="font-medium">{profile?.streak} days</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
