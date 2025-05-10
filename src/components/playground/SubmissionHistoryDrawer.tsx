import { ISubmission } from "@/types";
import React from "react";
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";
import { useCodeEditorContext } from "@/contexts/CodeEditorContext";
import { toast } from "sonner";

export default function SubmissionHistoryDrawer() {
  const { submissions, language, updateCode, changeLanguage } = useCodeEditorContext();

  const handleOnLoadSubmission = (submission: ISubmission) => {
    if (submission.language !== language) {
      changeLanguage(submission.language);
    }
    updateCode(submission.code);
    toast.success("Submission loaded");
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          Submissions ({submissions?.length})
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Your Submissions</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {submissions?.map((submission: ISubmission, index: number) => (
              <div
                key={submission.id}
                className={`border rounded-md p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                  submission.status === "solved" ? "border-green-200 bg-green-50/30 dark:bg-green-950/10" : submission.status === "failed" ? "border-red-200 bg-red-50/30 dark:bg-red-950/10" : "border-yellow-200 bg-yellow-50/30 dark:bg-yellow-950/10"
                }`}
                onClick={() => handleOnLoadSubmission(submission)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold">Submission #{submissions?.length - index}</span>
                    <div className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}</div>
                  </div>
                  <div
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      submission.status === "solved" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : submission.status === "failed" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    }`}
                  >
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <div className="px-2 py-1 bg-muted rounded-md">{submission.language}</div>
                  {submission.executionTime && <div className="px-2 py-1 bg-muted rounded-md">{submission.executionTime} ms</div>}
                  {submission.testResults && (
                    <div className="px-2 py-1 bg-muted rounded-md">
                      {submission.testResults.filter((t) => t.passed).length}/{submission.testResults.length} tests
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
