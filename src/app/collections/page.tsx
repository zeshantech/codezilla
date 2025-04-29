"use client";

import { CollectionList } from "@/components/collections/CollectionList";
import CreateCollectionDialog from "@/components/dialogs/CreateCollectionDialog";

export default function page() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Problem Collections</h1>
            <p className="text-muted-foreground max-w-3xl">Browse curated problem collections organized by topic, difficulty, and learning path to master programming concepts and prepare for technical interviews.</p>
          </div>

          <CreateCollectionDialog />
        </div>

        <CollectionList />
      </div>
    </div>
  );
}
