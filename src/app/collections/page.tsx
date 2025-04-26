"use client";

import { useState } from "react";
import { CollectionFilters } from "@/types";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { CollectionList } from "@/components/collections/CollectionList";
import { useCollections } from "@/hooks/useCollections";
import CreateCollectionDialog from "@/components/dialogs/CreateCollectionDialog";

export default function page() {
  const [filters, setFilters] = useState<CollectionFilters>({
    sortBy: "popularity",
  });

  // Get the hook
  const { useAllCollections } = useCollections();

  // Fetch collections with filters
  const { data: collections = [], isLoading } = useAllCollections(filters);

  // Handle filter changes
  const handleFilterChange = (newFilters: CollectionFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1 py-10">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Problem Collections</h1>
                <p className="text-muted-foreground max-w-3xl">
                  Browse curated problem collections organized by topic,
                  difficulty, and learning path to master programming concepts
                  and prepare for technical interviews.
                </p>
              </div>

              <CreateCollectionDialog />
            </div>

            <CollectionList />
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
