"use client";

import EnhancedPlayground from "@/components/playground/EnhancedPlayground";
import { SpinnerBackdrop } from "@/components/ui/spinner";
import { CodeEditorProvider } from "@/contexts/CodeEditorContext";
import { useProblems } from "@/hooks/useProblems";
import { ProgrammingLanguageEnum } from "@/types";

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
        <p className="text-muted-foreground ">The problem you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <CodeEditorProvider problemSlug={slug} initialLanguage={ProgrammingLanguageEnum.JAVASCRIPT}>
      <EnhancedPlayground />
    </CodeEditorProvider>
  );
}
