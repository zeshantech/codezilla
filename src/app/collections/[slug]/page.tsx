"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Users, Tag, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProblemCard } from "@/components/problems/ProblemCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { useCollections } from "@/hooks/useCollections";
import { Problem } from "@/types";

interface CollectionDetailPageProps {
  params: {
    slug: string;
  };
}

export default function page({ params }: CollectionDetailPageProps) {
  const { slug } = params;
  const { useCollection } = useCollections();

  // Fetch collection by slug
  const { data: collection, isLoading, isError } = useCollection(slug);

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

  if (isError || !collection) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1 py-10">
          <div className="container">
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <h1 className="text-2xl font-bold mb-4">Collection Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The collection you're looking for doesn't exist or has been
                removed.
              </p>
              <Button asChild>
                <Link href="/collections">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Collections
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  // Generate difficulty badge style
  const getDifficultyBadge = (difficulty?: string) => {
    if (!difficulty) return "";

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

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1 py-10">
        <div className="container">
          {/* Back button */}
          <Button variant="ghost" className="mb-6" href="/collections">
            <ArrowLeft />
            Back to Collections
          </Button>

          {/* Collection header */}
          <div className="flex flex-col gap-4 mb-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{collection.title}</h1>
                <p className="text-muted-foreground max-w-3xl">
                  {collection.description}
                </p>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    <Layout className="mr-1 h-4 w-4" />
                    {collection.problems?.length ||
                      collection.problemIds.length}{" "}
                    Problems
                  </Badge>

                  <Badge variant="outline" className="text-sm">
                    <Users className="mr-1 h-4 w-4" />
                    {collection.completionCount.toLocaleString()} Completions
                  </Badge>

                  {collection.difficulty && (
                    <Badge
                      variant="outline"
                      className={getDifficultyBadge(collection.difficulty)}
                    >
                      {collection.difficulty}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 justify-end">
                  {collection.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Problems list */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Problems in this Collection
              </h2>
              <Button
                variant="outline"
                href={`/playground/${collection.problems?.[0]?.slug || ""}`}
              >
                <BookOpen />
                Start Collection
              </Button>
            </div>

            {collection.problems && collection.problems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collection.problems.map((problem: Problem) => (
                  <ProblemCard key={problem.id} problem={problem} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No problems found</h3>
                <p className="text-muted-foreground">
                  This collection doesn't have any problems yet
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
