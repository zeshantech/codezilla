"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileCode,
  CopyCheck,
  PenSquare,
  Settings,
  Eye,
  EyeOff,
  MessageSquare,
  Brain,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useCodeEditorContext } from "@/contexts/CodeEditorContext";
import { SpinnerBox } from "../ui/spinner";
import { EmptyState } from "../ui/emptyState";
import { AiHelpPanel } from "./AiHelpPanel";
import { NotesPanel } from "./NotesPanel";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  visible: boolean;
  component: React.ReactNode;
}

// Tab Content Components
function DescriptionContent({ problem }: { problem: any }) {
  const [showConstraints, setShowConstraints] = useState<boolean>(true);

  return (
    <div className="text-sm">
      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: problem.description }}
      />

      <div>
        <div
          className="flex items-center justify-between cursor-pointer mb-1"
          onClick={() => setShowConstraints(!showConstraints)}
        >
          <h3 className="font-semibold text-base">Constraints</h3>
          {showConstraints ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        {showConstraints && (
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {problem.constraints.map((constraint: string, idx: number) => (
              <li key={idx}>{constraint}</li>
            ))}
          </ul>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-base mb-2">Examples</h3>
        <div className="space-y-4">
          {problem.examples.map((example: any, idx: number) => (
            <div key={idx} className="p-3 rounded-md bg-muted/30 border">
              <p className="font-medium">Example {idx + 1}:</p>
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-[auto,1fr] gap-2">
                  <div className="font-mono text-xs bg-background px-2 py-1 rounded">
                    Input:
                  </div>
                  <div className="font-mono text-xs bg-background px-2 py-1 rounded">
                    {example.input}
                  </div>
                </div>
                <div className="grid grid-cols-[auto,1fr] gap-2">
                  <div className="font-mono text-xs bg-background px-2 py-1 rounded">
                    Output:
                  </div>
                  <div className="font-mono text-xs bg-background px-2 py-1 rounded">
                    {example.output}
                  </div>
                </div>
                {example.explanation && (
                  <div>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      Explanation:
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {example.explanation}
                    </p>
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

function SolutionContent({ problem }: { problem: any }) {
  return (
    <div>
      {problem.solution ? (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-base">Solution</h3>
            <Select
              defaultValue="javascript"
              options={[
                { value: "javascript", label: "JavaScript" },
                { value: "python", label: "Python" },
                { value: "java", label: "Java" },
                { value: "cpp", label: "C++" },
              ]}
            />
          </div>
          <div className="bg-muted/30 p-3 rounded-md font-mono text-xs whitespace-pre-wrap overflow-auto">
            <p>Solution code would be displayed here</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <FileCode className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No solution available</h3>
          <p className="text-muted-foreground">
            Solution for this problem is not available yet.
          </p>
        </div>
      )}
    </div>
  );
}

function SubmissionsContent() {
  return (
    <div className="py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4 mx-auto w-fit">
        <PenSquare className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">Your Submissions</h3>
      <p className="text-muted-foreground">
        You haven't submitted any solutions yet.
      </p>
    </div>
  );
}

export function ProblemViewer() {
  const { problem, isLoadingProblem } = useCodeEditorContext();
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
    setTabConfig((prev) =>
      prev.map((tab) =>
        tab.id === tabId ? { ...tab, visible: !tab.visible } : tab
      )
    );
  };

  // Initialize tab config when problem is available
  useEffect(() => {
    if (problem) {
      setTabConfig([
        {
          id: "description",
          label: "Description",
          icon: <BookOpen className="h-4 w-4" />,
          visible: true,
          component: <DescriptionContent problem={problem} />,
        },
        {
          id: "solution",
          label: "Solution",
          icon: <CopyCheck className="h-4 w-4" />,
          visible: true,
          component: <SolutionContent problem={problem} />,
        },
        {
          id: "submissions",
          label: "Submissions",
          icon: <PenSquare className="h-4 w-4" />,
          visible: true,
          component: <SubmissionsContent />,
        },
        {
          id: "ai-help",
          label: "AI Help",
          icon: <Brain className="h-4 w-4" />,
          visible: true,
          component: <AiHelpPanel />,
        },
        {
          id: "notes",
          label: "Notes",
          icon: <MessageSquare className="h-4 w-4" />,
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
    return (
      <EmptyState
        title="Problem not found"
        description="The problem you're looking for doesn't exist or has been removed."
        icon={<FileCode />}
      />
    );
  }

  return (
    <Card className="h-full overflow-auto">
      <CardHeader className="space-y-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle>{problem.title}</CardTitle>
              <Badge variant={getDifficultyBadge(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{problem.category}</Badge>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2 hover:bg-muted rounded-md">
                    <Settings className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Tab Settings</h4>
                    {tabConfig.map((tab) => (
                      <div
                        key={tab.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {tab.icon}
                          <Label>{tab.label}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleTabVisibility(tab.id)}
                            className="p-1 hover:bg-muted rounded-md"
                            title={tab.visible ? "Hide tab" : "Show tab"}
                          >
                            {tab.visible ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
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
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="space-y-4 h-full">
        {tabConfig.find((tab) => tab.id === activeTab)?.component}
      </CardContent>
    </Card>
  );
}

// Simple Select component for the solution tab
function Select({
  defaultValue,
  options,
}: {
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative inline-block text-left">
      <select
        className="bg-muted/30 text-xs rounded-md px-2 py-1 border-border"
        defaultValue={defaultValue}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
