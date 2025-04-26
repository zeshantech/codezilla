"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileCode,
  CopyCheck,
  PenSquare,
} from "lucide-react";
import { Problem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

interface ProblemDetailProps {
  problem: Problem;
}

export function ProblemDetail({ problem }: ProblemDetailProps) {
  const [showConstraints, setShowConstraints] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("description");

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
            <Badge variant="secondary">{problem.category}</Badge>
          </div>
          <div className="flex flex-wrap gap-1">
            {problem.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="description">
              <BookOpen />
              Description
            </TabsTrigger>
            <TabsTrigger value="solution">
              <CopyCheck />
              Solution
            </TabsTrigger>
            <TabsTrigger value="submissions">
              <PenSquare />
              Submissions
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="space-y-4">
        {activeTab === "description" && (
          <div className=" text-sm">
            {/* Description */}
            <div>
              <p className="whitespace-pre-line">{problem.description}</p>
            </div>

            {/* Constraints */}
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
                  {problem.constraints.map((constraint, idx) => (
                    <li key={idx}>{constraint}</li>
                  ))}
                </ul>
              )}
            </div>

            <Separator />

            {/* Examples */}
            <div>
              <h3 className="font-semibold text-base mb-2">Examples</h3>
              <div className="space-y-4">
                {problem.examples.map((example, idx) => (
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
        )}

        {activeTab === "solution" && (
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
                  {/* This would be a code block with the solution */}
                  <p>Solution code would be displayed here</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <FileCode className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">
                  No solution available
                </h3>
                <p className="text-muted-foreground">
                  Solution for this problem is not available yet.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "submissions" ? (
          <div className="py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4 mx-auto w-fit">
              <PenSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">Your Submissions</h3>
            <p className="text-muted-foreground">
              You haven't submitted any solutions yet.
            </p>
          </div>
        ) : null}
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

export default ProblemDetail;
