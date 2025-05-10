"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { ProblemList } from "@/components/problems/ProblemList";
import CreateProblemDialog from "@/components/dialogs/CreateProblemDialog";
import { Suspense } from "react";

// Wrap the page with the query client provider
export default function page() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1 py-10">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Coding Problems</h1>
                <p className="text-muted-foreground max-w-3xl">
                  Browse coding challenges by difficulty, category, or keyword
                  to practice and improve your programming skills.
                </p>
              </div>
              <CreateProblemDialog />
            </div>

            <Suspense fallback={<div>Loading collections...</div>}>
              <ProblemList />
            </Suspense>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
