"use client";

import { Search } from "lucide-react";
import { DifficultyEnum, IProblem } from "@/types";
import { Separator } from "@/components/ui/separator";
import { ProblemCard } from "./ProblemCard";
import { ProblemFilters, IProblemFilters } from "./ProblemFilters";
import useProblems from "@/hooks/useProblems";
import { EmptyState, ErrorState } from "../ui/emptyState";
import { Skeleton } from "../ui/skeleton";
import { useSearchParams } from "next/navigation";

export function ProblemList() {
  const { useAllProblems } = useProblems();
  const searchParams = useSearchParams();

  // Extract filters from URL params
  const filters: IProblemFilters = {
    search: searchParams.get("search") || undefined,
    difficulties: searchParams.getAll("difficulty") as DifficultyEnum[],
    categories: searchParams.getAll("category"),
    sortBy: (searchParams.get("sortBy") as IProblemFilters["sortBy"]) || undefined,
  };

  const { data: allProblems, isLoading: isAllProblemsLoading, error: allProblemsError } = useAllProblems(filters);

  return (
    <div className="space-y-6">
      <ProblemFilters />

      <Separator />

      {/* Problems Grid */}
      {isAllProblemsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[220px] rounded-lg"></Skeleton>
          ))}
        </div>
      ) : allProblemsError ? (
        <ErrorState title="Error loading problems" description="Something went wrong while loading problems. Please try again later." />
      ) : allProblems?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProblems.map((problem: IProblem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      ) : (
        <EmptyState title="No problems found" description="Try adjusting your filters or search for something else" icon={<Search />} />
      )}
    </div>
  );
}

export default ProblemList;
