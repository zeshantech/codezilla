"use client";

import { useState, useEffect } from "react";
import { BookOpen, FileCode, CopyCheck, PenSquare, Settings, Eye, EyeOff, MessageSquare, Brain, Timer, Watch, Clock, MemoryStick, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { SpinnerBox } from "../ui/spinner";
import { EmptyState } from "../ui/emptyState";
import { AiHelpPanel } from "./AiHelpPanel";
import { NotesPanel } from "./NotesPanel";
import { ISubmission } from "@/types/submissions";
import { ResultStatusEnum } from "@/types/enums";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Copier from "../ui/copier";
import { useSubmissions } from "@/hooks/useCodeEditor";
import { SubmissionDetails } from "./SubmissionDetails";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import dayjs from "dayjs";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  visible: boolean;
  component: React.ReactNode;
}

// Tab Content Components
function DescriptionContent({ problem }: { problem: any }) {
  return (
    <div className="text-sm space-y-4">
      <div
        dangerouslySetInnerHTML={{
          __html: problem.description,
        }}
        className="space-y-6 blog-content [&>h1]:text-3xl [&>h1]:font-bold [&>h2]:text-2xl [&>h2]:font-semibold [&>h3]:text-xl [&>h3]:font-semibold [&>p]:my-4 [&>ul]:list-disc [&>ul]:list-inside [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:space-y-2 [&>li]:ml-4 [&>img]:w-full [&>img]:rounded-lg [&>a]:text-blue-500 [&>a]:underline [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>pre]:bg-gray-100 [&>pre]:dark:bg-gray-800 [&>pre]:p-4 [&>pre]:rounded [&>code]:font-mono [&>code]:text-sm [&>table]:w-full [&>table]:border-collapse [&>th]:border [&>th]:border-gray-300 [&>th]:dark:border-gray-700 [&>th]:p-2 [&>td]:border [&>td]:border-gray-300 [&>td]:dark:border-gray-700 [&>td]:p-2"
      />

      <Separator />

      <div>
        <h3 className="font-semibold text-base mb-2">Examples</h3>
        <div className="space-y-4">
          {problem.examples.map((example: any, idx: number) => (
            <div key={idx} className="p-3 rounded-md bg-muted/30 border">
              <p className="font-medium">Example {idx + 1}:</p>
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-[auto,1fr] gap-2">
                  <div className="font-mono text-xs bg-background px-2 py-1 rounded">Input:</div>
                  <div className="font-mono text-xs bg-background px-2 py-1 rounded">{example.input}</div>
                </div>
                <div className="grid grid-cols-[auto,1fr] gap-2">
                  <div className="font-mono text-xs bg-background px-2 py-1 rounded">Output:</div>
                  <div className="font-mono text-xs bg-background px-2 py-1 rounded">{example.output}</div>
                </div>
                {example.explanation && (
                  <div>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">Explanation:</p>
                    <p className="text-xs text-muted-foreground mt-1">{example.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SolutionContent() {
  const problem = useCodeEditorStore((state) => state.problem);

  return (
    <div className="space-y-4">
      {problem?.solution ? (
        Object.entries(problem.solution).map(([language, solution], idx) => (
          <div className="max-h-96" key={idx}>
            <h3 className="font-medium mb-2 capitalize">{language}</h3>
            <div className="bg-muted p-4 rounded-md overflow-auto relative group">
              <Copier text={solution} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" />
              <pre className="text-xs">
                <code>{solution}</code>
              </pre>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <FileCode className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No solution available</h3>
          <p className="text-muted-foreground">Solution for this problem is not available yet.</p>
        </div>
      )}
    </div>
  );
}

function SubmissionsContent() {
  const problem = useCodeEditorStore((state) => state.problem);
  const { data: submissions, isLoading: isLoadingSubmissions } = useSubmissions(problem?.id || "");
  const codeEditorRef = useCodeEditorStore((state) => state.codeEditorRef);

  const handleLoadSubmission = (code: string) => {
    if (codeEditorRef) {
      codeEditorRef.setValue(code);
      toast.success("Code loaded successfully");
    } else {
      toast.error("Code editor not ready");
    }
  };

  const handleLoadCode = (submission: ISubmission) => {
    handleLoadSubmission(submission.code);
  };

  if (isLoadingSubmissions) {
    return <SpinnerBox />;
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4 mx-auto w-fit">
          <PenSquare className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">Your Submissions</h3>
        <p className="text-muted-foreground">You haven't submitted any solutions yet.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {submissions.map((submission: ISubmission) => (
        <AccordionItem
          key={submission.id}
          className={`rounded-md border ${submission.resultStatus === ResultStatusEnum.SUCCESS ? "bg-success/10 border-success/30" : "bg-error/10 border-error/30"}`}
          value={submission.id}
        >
          <AccordionTrigger className="flex justify-between items-center hover:no-underline p-2">
            <div className="flex items-center gap-2">
              <Badge variant={submission.resultStatus === ResultStatusEnum.SUCCESS ? "success" : submission.resultStatus === ResultStatusEnum.FAILED ? "error" : "warning"}>
                {submission.resultStatus}
              </Badge>
              <span className="text-xs text-muted-foreground">{dayjs(submission.createdAt).format("MMM D, YYYY h:mm A")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadCode(submission);
                }}
              >
                Load Code
              </Button>
              {submission.executionTime && (
                <Badge variant="outline" className="bg-muted">
                  <Clock className="size-3" />
                  {submission.executionTime} ms
                </Badge>
              )}
              {submission.memoryUsed && (
                <Badge variant="outline" className="bg-muted">
                  <Cpu className="size-3" />
                  {submission.memoryUsed} MB
                </Badge>
              )}
            </div>
          </AccordionTrigger>

          <AccordionContent className="bg-background p-2">
            <SubmissionDetails problemId={problem?.id || ""} submissionId={submission.id} onLoadCode={handleLoadSubmission} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function ProblemViewer() {
  const problem = useCodeEditorStore((state) => state.problem);
  const isLoadingProblem = useCodeEditorStore((state) => state.isLoadingProblem);

  const [activeTab, setActiveTab] = useState<string>("description");
  const [tabConfig, setTabConfig] = useState<TabConfig[]>([]);

  // Generate the difficulty badge styles
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "success";
      case "Medium":
        return "warning";
      case "Hard":
        return "error";
      default:
        return "muted";
    }
  };

  const toggleTabVisibility = (tabId: string) => {
    setTabConfig((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, visible: !tab.visible } : tab)));
  };

  // Initialize tab config when problem is available
  useEffect(() => {
    if (problem) {
      setTabConfig([
        {
          id: "description",
          label: "Description",
          icon: <BookOpen className="size-4" />,
          visible: true,
          component: <DescriptionContent problem={problem} />,
        },
        {
          id: "solution",
          label: "Solution",
          icon: <CopyCheck className="size-4" />,
          visible: true,
          component: <SolutionContent />,
        },
        {
          id: "submissions",
          label: "Submissions",
          icon: <PenSquare className="size-4" />,
          visible: true,
          component: <SubmissionsContent />,
        },
        {
          id: "ai-help",
          label: "AI Help",
          icon: <Brain className="size-4" />,
          visible: true,
          component: <AiHelpPanel />,
        },
        {
          id: "notes",
          label: "Notes",
          icon: <MessageSquare className="size-4" />,
          visible: true,
          component: <NotesPanel problemId={problem.id} />,
        },
      ]);
    }
  }, [problem]);

  if (isLoadingProblem) {
    return <SpinnerBox />;
  }

  if (!problem) {
    return <EmptyState title="Problem not found" description="The problem you're looking for doesn't exist or has been removed." icon={<FileCode />} />;
  }

  return (
    <Card className="h-full overflow-auto border-none shadow-none">
      <CardHeader className="space-y-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle>{problem.title}</CardTitle>
              <Badge variant={getDifficultyBadge(problem.difficulty)}>{problem.difficulty}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{problem.category}</Badge>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2 hover:bg-muted rounded-md">
                    <Settings className="size-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Tab Settings</h4>
                    {tabConfig.map((tab) => (
                      <div key={tab.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {tab.icon}
                          <Label>{tab.label}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleTabVisibility(tab.id)} className="p-1 hover:bg-muted rounded-md" title={tab.visible ? "Hide tab" : "Show tab"}>
                            {tab.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {problem.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            {tabConfig
              .filter((tab) => tab.visible)
              .map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="space-y-4 h-full">{tabConfig.find((tab) => tab.id === activeTab)?.component}</CardContent>
    </Card>
  );
}
