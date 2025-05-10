"use client";

import { use as useReact } from "react";
import { ArrowLeft, BookOpen, Users, Layout, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProblemCard } from "@/components/problems/ProblemCard";
import { useCollections } from "@/hooks/useCollections";
import { IProblem } from "@/types";
import { SpinnerBackdrop } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/emptyState";
import { useRouter } from "next/navigation";

interface CollectionDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function Page({ params }: CollectionDetailPageProps) {
  const { slug } = useReact(params);
  const router = useRouter();

  const { useCollection } = useCollections();

  const { data: collection, isLoading, isError } = useCollection(slug);

  if (isLoading) {
    return <SpinnerBackdrop show={true} size={"xlarge"} />;
  }

  if (isError || !collection) {
    return (
      <EmptyState
        title="Collection Not Found"
        description="The collection you're looking for doesn't exist or has been removed."
        icon={<AlertCircle />}
        button={
          <Button href="/collections">
            <ArrowLeft />
            Back to collections
          </Button>
        }
      />
    );
  }

  // Generate difficulty badge style
  const getDifficultyBadge = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "muted";
    }
  };

  return (
    <div className="container mx-auto">
      {/* Back button */}

      {/* Collection header */}
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-4">
            <Button size={"icon"} variant="outline" onClick={() => router.back()}>
              <ArrowLeft />
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2">{collection.title}</h1>
              <p className="text-muted-foreground max-w-3xl">{collection.description}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Layout />
                {collection.problems?.length || collection.problems?.length} Problems
              </Badge>

              <Badge variant="outline">
                <Users />
                {collection.completionCount.toLocaleString()} Completions
              </Badge>

              {collection.difficulty && <Badge variant={getDifficultyBadge(collection.difficulty)}>{collection.difficulty}</Badge>}
            </div>

            <div className="flex flex-wrap gap-1 justify-end">
              {collection.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
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
          <h2 className="text-2xl font-bold">Problems in this Collection</h2>
          <Button variant="outline" href={`/playground/${(collection.problems as IProblem[])?.[0]?.slug || ""}`}>
            <BookOpen />
            Start Collection
          </Button>
        </div>

        {Array.isArray(collection.problems) && collection.problems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(collection.problems as IProblem[]).map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        ) : (
          <EmptyState title="No problems in this collection" description="This collection doesn't have any problems yet." icon={<BookOpen />} />
        )}
      </div>
    </div>
  );
}
