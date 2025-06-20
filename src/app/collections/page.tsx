import { Suspense } from "react";
import { CollectionList } from "@/components/collections/CollectionList";
import CreateCollectionDialog from "@/components/dialogs/CreateCollectionDialog";
import { Metadata } from "next";
import { auth0 } from "@/lib/auth0";

export const metadata: Metadata = {
  title: "Collections | CodeZilla",
  description: "Browse curated problem collections organized by topic, difficulty, and learning path to master programming concepts and prepare for technical interviews.",
};

export default async function page() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Collections</h1>
          <p className="text-muted-foreground max-w-3xl">Browse curated collections organized by topic, difficulty, and learning path to master programming concepts and prepare for technical interviews.</p>
        </div>

        {user && <CreateCollectionDialog />}
      </div>

      <Suspense fallback={<div>Loading collections...</div>}>
        <CollectionList />
      </Suspense>
    </div>
  );
}
