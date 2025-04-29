"use client";

import { ArrowRight, Users, Folder, BookOpen, Award } from "lucide-react";
import { ICollection } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CollectionCardProps {
  collection: ICollection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const getDifficultyBadge = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      case "mixed":
        return "secondary";
      default:
        return "muted";
    }
  };

  const formatCompletionCount = (count: number) => {
    return count > 999 ? `${(count / 1000).toFixed(1)}k` : count;
  };

  return (
    <Card className="group hover:border-primary/50 transition-colors h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            <CardTitle className="line-clamp-2">{collection.title}</CardTitle>
          </div>
          {collection.isFeatured && (
            <Badge variant="outline">
              <Award />
              Featured
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{collection.problems?.length} problems</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{formatCompletionCount(collection.completionCount)} completions</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm line-clamp-2 text-muted-foreground">{collection.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {collection.difficulty && <Badge variant={getDifficultyBadge(collection.difficulty)}>{collection.difficulty}</Badge>}
          {collection.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {collection.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{collection.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full" href={`/collections/${collection.slug}`}>
          View Collection <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CollectionCard;
