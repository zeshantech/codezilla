"use client";

import { Search } from "lucide-react";
import { CollectionCard } from "./CollectionCard";
import { Separator } from "@/components/ui/separator";
import { CollectionFilters } from "./CollectionFilters";
import useCollections from "@/hooks/useCollections";

export function CollectionList() {
  const { allCollections, isAllCollectionsLoading } = useCollections();

  return (
    <div className="space-y-6">
      <CollectionFilters />

      <Separator />

      {/* Collections Grid */}
      {isAllCollectionsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[220px] rounded-lg bg-muted"></div>
          ))}
        </div>
      ) : allCollections?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No collections found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search for something else
          </p>
        </div>
      )}
    </div>
  );
}

export default CollectionList;
