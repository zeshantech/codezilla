"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSubmission } from "@/hooks/useCodeEditor";
import { PerformanceChart } from "./PerformanceChart";
import { CopyIcon, FileX } from "lucide-react";
import { SpinnerBox } from "../ui/spinner";
import { EmptyState } from "../ui/emptyState";
import Copier from "../ui/copier";

interface SubmissionDetailsProps {
  problemId: string;
  submissionId: string;
  onLoadCode: (code: string) => void;
}

export function SubmissionDetails({ problemId, submissionId, onLoadCode }: SubmissionDetailsProps) {
  const { data: submissionData, isLoading, error } = useSubmission(problemId, submissionId);

  if (isLoading) {
    return <SpinnerBox className="h-32" />;
  }

  if (!submissionData || error) {
    return (
      <EmptyState
        title={error ? "Error loading submission" : "Submission not found"}
        description={error ? error.message : "The submission you are looking for does not exist."}
        icon={<FileX className="size-4" />}
      />
    );
  }

  return (
    <div className="space-y-4 p-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Runtime: {submissionData.executionTime || 0} ms</Badge>
          <Badge variant="outline">Memory: {submissionData.memoryUsed || 0} MB</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onLoadCode(submissionData.code)}>
            Load Code
          </Button>
          <Copier text={submissionData.code} />
        </div>
      </div>

      <Separator />

      {submissionData.runtimeDistribution && submissionData.memoryDistribution && (
        <PerformanceChart
          runtimeMs={submissionData.executionTime || 0}
          memoryMB={submissionData.memoryUsed || 0}
          runtimePercentile={submissionData.runtimePercentile || 0}
          memoryPercentile={submissionData.memoryPercentile || 0}
          runtimeDistribution={submissionData.runtimeDistribution}
          memoryDistribution={submissionData.memoryDistribution}
        />
      )}

      <Separator />

      <div className="group">
        <h3 className="text-sm font-medium mb-2">Code</h3>
        <div className="bg-muted p-4 rounded-md overflow-auto max-h-96 relative">
          <Copier text={submissionData.code} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" />
          <pre className="text-xs">
            <code>{submissionData.code}</code>
          </pre>
        </div>
      </div>

      {submissionData.logs && submissionData.logs.length > 0 && (
        <div className="group">
          <h3 className="text-sm font-medium mb-2">Logs</h3>
          <div className="bg-muted p-4 rounded-md overflow-auto max-h-40 relative">
            <Copier text={submissionData.logs.join("\n")} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" />
            <pre className="text-xs">
              <code>{submissionData.logs.join("\n")}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
