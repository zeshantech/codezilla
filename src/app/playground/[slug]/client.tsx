"use client";

import EnhancedPlayground from "@/components/playground/EnhancedPlayground";
import { Spinner } from "@/components/ui/spinner";
import { SpinnerBackdrop } from "@/components/ui/spinner";
import { useProblems } from "@/hooks/useProblems";

export default function Playground({ slug }: { slug: string }) {
  const { useProblem } = useProblems();
  const { data: problem, isLoading, isError } = useProblem(slug);

  if (isLoading) {
    return (
      <SpinnerBackdrop show={true} size="xlarge">
        Loading Editor...
      </SpinnerBackdrop>
    );
  }

  // Error state
  if (isError || !problem) {
    return (
      <div className="flex flex-col items-center justify-center h-screen   text-center">
        <h1 className="text-2xl font-bold mb-2">Problem Not Found</h1>
        <p className="text-muted-foreground ">
          The problem you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return <EnhancedPlayground problem={problem} slug={slug} />;
}
