"use client";

import { Search } from "lucide-react";
import { CollectionCard } from "./CollectionCard";
import { Separator } from "@/components/ui/separator";
import { CollectionFilters } from "./CollectionFilters";
import useCollections from "@/hooks/useCollections";
import { EmptyState, ErrorState } from "../ui/emptyState";
import { Skeleton } from "../ui/skeleton";
import { useSearchParams } from "next/navigation";
import { SortOption } from "@/types";

export function CollectionList() {
  const { useAllCollections } = useCollections();
  const searchParams = useSearchParams();

  // Extract filters from URL params
  const filters = {
    search: searchParams.get("search") || undefined,
    tags: searchParams.getAll("tags"),
    featured: searchParams.get("featured") === "true" ? true : undefined,
    sortBy: searchParams.get("sortBy") as SortOption | undefined,
  };

  const { data: allCollections, isLoading: isAllCollectionsLoading, error: allCollectionsError } = useAllCollections(filters);

  return (
    <div className="space-y-6">
      <CollectionFilters />

      <Separator />

      {/* Collections Grid */}
      {isAllCollectionsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[220px] rounded-lg"></Skeleton>
          ))}
        </div>
      ) : allCollectionsError ? (
        <ErrorState title="Error loading collections" description="Something went wrong while loading collections. Please try again later." />
      ) : allCollections?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <EmptyState title="No collections found" description="Try adjusting your filters or search for something else" icon={<Search />} />
      )}
    </div>
  );
}

export default CollectionList;
