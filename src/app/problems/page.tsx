import { ProblemList } from "@/components/problems/ProblemList";
import CreateProblemDialog from "@/components/dialogs/CreateProblemDialog";
import { Suspense } from "react";
import { Metadata } from "next";
import { auth0 } from "@/lib/auth0";

export const metadata: Metadata = {
  title: "Problems | CodeZilla",
  description: "Browse coding challenges by difficulty, category, or keyword to practice and improve your programming skills.",
};

export default async function page() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Coding Problems</h1>
          <p className="text-muted-foreground max-w-3xl">Browse coding challenges by difficulty, category, or keyword to practice and improve your programming skills.</p>
        </div>
        {user && <CreateProblemDialog />}
      </div>

      <Suspense fallback={<div>Loading problems...</div>}>
        <ProblemList />
      </Suspense>
    </div>
  );
}
