"use client";

import { Search } from "lucide-react";
import { IProblem } from "@/types";
import { Separator } from "@/components/ui/separator";
import { ProblemCard } from "./ProblemCard";
import { ProblemFilters } from "./ProblemFilters";
import useProblems from "@/hooks/useProblems";

export function ProblemList() {
  const { allProblems, isAllProblemsLoading } = useProblems();

  return (
    <div className="space-y-6">
      <ProblemFilters />

      <Separator />

      {/* Problems Grid */}
      {isAllProblemsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[220px] rounded-lg bg-muted"></div>
          ))}
        </div>
      ) : allProblems?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProblems.map((problem: IProblem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Search className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No problems found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search for something else
          </p>
        </div>
      )}
    </div>
  );
}

export default ProblemList;
