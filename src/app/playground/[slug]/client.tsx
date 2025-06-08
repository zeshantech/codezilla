"use client";

import EnhancedPlayground from "@/components/playground/EnhancedPlayground";
import { SpinnerBackdrop } from "@/components/ui/spinner";
import { useCodeEditorStore, useInitializeCodeEditor } from "@/store/useCodeEditorStore";

export default function Playground({ slug }: { slug: string }) {
  useInitializeCodeEditor(slug);
  const problem = useCodeEditorStore((state) => state.problem);
  const isLoadingProblem = useCodeEditorStore((state) => state.isLoadingProblem);
  const isErrorLoadingProblem = useCodeEditorStore((state) => state.isErrorLoadingProblem);

  if (isLoadingProblem) {
    return (
      <SpinnerBackdrop show={true} size="xlarge">
        Loading Editor...
      </SpinnerBackdrop>
    );
  }

  if (isErrorLoadingProblem && !problem) {
    return (
      <div className="flex flex-col items-center justify-center h-screen   text-center">
        <h1 className="text-2xl font-bold mb-2">Problem Not Found</h1>
        <p className="text-muted-foreground ">The problem you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return <EnhancedPlayground />;
}
