"use client";

import { ArrowRight, Star, CheckCircle2, Clock, Award } from "lucide-react";
import { IProblem } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CURRENT_USER } from "@/data/mock/users";

interface ProblemCardProps {
  problem: IProblem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  // Check user's progress on this problem
  const userProgress = CURRENT_USER.problemsProgress['two-sum']; // TODO: problem.id
  const problemStatus = userProgress?.status || "not_started";

  // Generate the difficulty badge styles
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "muted";
    }
  };

  // Generate the status badge styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "solved":
        return "success";
      case "attempted":
        return "warning";
      case "not_started":
      default:
        return "muted";
    }
  };

  // Format popularity for display
  const formatPopularity = (popularity: number) => {
    return popularity > 999 ? `${(popularity / 1000).toFixed(1)}k` : popularity;
  };

  return (
    <Card className="group hover:border-primary/50 transition-colors h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <CardTitle>{problem.title}</CardTitle>
            <Badge variant={getDifficultyBadge(problem.difficulty)}>{problem.difficulty}</Badge>
            {problemStatus !== "not_started" && (
              <Badge variant={getStatusBadge(problemStatus)}>
                {problemStatus === "solved" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                {problemStatus === "solved" ? "Solved" : "Attempted"}
              </Badge>
            )}
            {problem.isFeatured && (
              <Badge variant="default">
                <Award className="" />
                Featured
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Star className="h-4 w-4 text-warning" />
            <span>{formatPopularity(problem.popularity)}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">{problem.category}</div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm line-clamp-2 text-muted-foreground">{problem.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {problem.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {problem.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{problem.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="!w-full" href={`/playground/${problem.slug}`}>
          {problemStatus === "solved" ? "View Solution" : problemStatus === "attempted" ? "Continue Solving" : "Solve Problem"}
          <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProblemCard;
