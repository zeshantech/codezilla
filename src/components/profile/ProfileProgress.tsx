"use client";

import { UserProfile, ProblemsByCategory } from "@/types/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Code, ListFilter } from "lucide-react";

interface ProfileProgressProps {
  user: UserProfile;
  problemsByCategory: ProblemsByCategory[];
}

export function ProfileProgress({
  user,
  problemsByCategory,
}: ProfileProgressProps) {
  // Calculate problem progress
  const totalProblems = problemsByCategory.reduce(
    (acc, category) => acc + category.problemStatusCount.total,
    0
  );

  const solvedByDifficulty = {
    Easy: 0,
    Medium: 0,
    Hard: 0,
  };

  const totalByDifficulty = {
    Easy: 0,
    Medium: 0,
    Hard: 0,
  };

  // Count problems by difficulty
  problemsByCategory.forEach((category) => {
    category.problems.forEach((problem: any) => {
      // totalByDifficulty[problem.difficulty]++;

      // // Check if the user has solved this problem
      // const progress = user.problemsProgress[problem.id];
      // if (progress && progress.status === "solved") {
      //   solvedByDifficulty[problem.difficulty]++;
      // }
    });
  });

  // Calculate total solved problems
  const totalSolved = problemsByCategory.reduce(
    (acc, category) => acc + category.problemStatusCount.solved,
    0
  );

  const solvedPercentage =
    totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
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
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">By Difficulty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-success flex items-center gap-1">
                  <Badge variant="success" className="h-2 w-2 p-0" /> Easy
                </span>
                <span>
                  {solvedByDifficulty.Easy} / {totalByDifficulty.Easy}
                </span>
              </div>
              <Progress
                value={
                  totalByDifficulty.Easy > 0
                    ? (solvedByDifficulty.Easy / totalByDifficulty.Easy) * 100
                    : 0
                }
                className="bg-success/20"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-warning flex items-center gap-1">
                  <Badge variant="warning" className="h-2 w-2 p-0" /> Medium
                </span>
                <span>
                  {solvedByDifficulty.Medium} / {totalByDifficulty.Medium}
                </span>
              </div>
              <Progress
                value={
                  totalByDifficulty.Medium > 0
                    ? (solvedByDifficulty.Medium / totalByDifficulty.Medium) *
                      100
                    : 0
                }
                className="bg-warning/20"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-error flex items-center gap-1">
                  <Badge variant="error" className="h-2 w-2 p-0" /> Hard
                </span>
                <span>
                  {solvedByDifficulty.Hard} / {totalByDifficulty.Hard}
                </span>
              </div>
              <Progress
                value={
                  totalByDifficulty.Hard > 0
                    ? (solvedByDifficulty.Hard / totalByDifficulty.Hard) * 100
                    : 0
                }
                className="bg-error/20"
              />
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
              <span className="font-medium">{10}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <ListFilter className="h-4 w-4" /> Collections Completed
              </span>
              <span className="font-medium">{100}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" /> Current Streak
              </span>
              <span className="font-medium">{10} days</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
