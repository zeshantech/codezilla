"use client";

import { useState } from "react";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Tag,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProblemDetail } from "@/components/problems/ProblemDetail";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { useProblems } from "@/hooks/useProblems";
import { CURRENT_USER } from "@/data/mock/users";

// Create a client
interface ProblemDetailPageProps {
  params: {
    slug: string;
  };
}

function ProblemView({ params }: ProblemDetailPageProps) {
  const { slug } = params;
  const { useProblem } = useProblems();
  const [activeTab, setActiveTab] = useState("description");

  // Fetch problem by slug
  const { data: problem, isLoading, isError } = useProblem(slug);

  // Get user's progress on this problem
  const userProgress = problem
    ? CURRENT_USER.problemsProgress[problem.id]
    : undefined;
  const problemStatus = userProgress?.status || "not_started";

  // Handle not found or error
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1 py-10">
          <div className="container">
            <div className="flex items-center justify-center h-[400px]">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-64 bg-muted rounded mb-4"></div>
                <div className="h-4 w-96 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1 py-10">
          <div className="container">
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <h1 className="text-2xl font-bold mb-4">Problem Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The problem you're looking for doesn't exist or has been
                removed.
              </p>
              <Button asChild>
                <Link href="/problems">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Problems
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  // Generate difficulty badge styles
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "Hard":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Generate status badge styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "solved":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "attempted":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "not_started":
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1 py-10">
        <div className="container">
          {/* Back button */}
          <Button variant="ghost" asChild className="mb-6" href="/problems">
            <ArrowLeft />
            Back to Problems
          </Button>

          {/* Problem header */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{problem.title}</h1>
                  <Badge
                    variant="outline"
                    className={getDifficultyBadge(problem.difficulty)}
                  >
                    {problem.difficulty}
                  </Badge>
                  {problemStatus !== "not_started" && (
                    <Badge
                      variant="outline"
                      className={getStatusBadge(problemStatus)}
                    >
                      {problemStatus === "solved" ? (
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                      ) : (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      {problemStatus === "solved" ? "Solved" : "Attempted"}
                    </Badge>
                  )}
                </div>
                <div className="text-muted-foreground">{problem.category}</div>
              </div>

              <div className="flex gap-2">
                <Button variant="default" asChild>
                  <Link href={`/playground/${problem.slug}`}>
                    {problemStatus === "solved"
                      ? "View Solution"
                      : problemStatus === "attempted"
                      ? "Continue Solving"
                      : "Solve Problem"}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {problem.completionCount.toLocaleString()} completions
                </span>
              </div>
              <div className="flex flex-wrap gap-1 items-center">
                <Tag className="h-4 w-4 text-muted-foreground mr-1" />
                {problem.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Problem content tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="mb-6">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="hints">Hints & Solutions</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <ProblemDetail problem={problem} />
            </TabsContent>

            <TabsContent value="hints" className="mt-0">
              <div className="space-y-4">
                <div className="rounded-lg border p-6">
                  <h3 className="text-lg font-medium mb-3">Hints</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/40 rounded">
                      <p>
                        Try thinking about this problem in terms of a hash map
                        for O(n) time complexity.
                      </p>
                    </div>
                    <div className="p-3 bg-muted/40 rounded">
                      <p>
                        Consider what happens when you encounter a duplicate
                        value.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-6">
                  <h3 className="text-lg font-medium mb-3">
                    Community Solutions
                  </h3>
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Solutions are available after you solve the problem or
                      unlock them.
                    </p>
                    <Button className="mt-4" variant="outline">
                      Unlock Solutions
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="discussion" className="mt-0">
              <div className="rounded-lg border p-6 text-center py-12">
                <h3 className="text-lg font-medium mb-3">Discussion</h3>
                <p className="text-muted-foreground">
                  Join the conversation about this problem with other
                  developers.
                </p>
                <Button className="mt-4" variant="outline">
                  View Discussions
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

export default function ProblemDetailPage({ params }: ProblemDetailPageProps) {
  return <ProblemView params={params} />;
}
