"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Code,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Code2,
  RussianRuble,
  Brain,
  Link,
} from "lucide-react";

// Layout components
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";

// Feature components
import { EditorPanel } from "@/components/editor/EditorPanel";
import { ProblemList } from "@/components/problems/ProblemList";
import { CollectionList } from "@/components/collections/CollectionList";

// Hooks
import { useProblems } from "@/hooks/useProblems";
import { useCollections } from "@/hooks/useCollections";
import ProblemCard from "@/components/problems/ProblemCard";
import { Collection, Problem } from "@/types";
import { CollectionCard } from "@/components/collections/CollectionCard";

// Create a client
export default function page() {
  const [activeTab, setActiveTab] = useState("playground");

  // Get hooks
  const { featuredProblems } = useProblems();
  const { featuredCollections } = useCollections();

  // Fetch featured problems
  // Fetch featured collections
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1 container mx-auto">
        <section className="py-10 md:py-16 bg-gradient-to-b from-background to-muted/20">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                Your playground for coding mastery
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Master Coding with
                <span className="text-primary"> LogicLab</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px]">
                Solve coding challenges, practice algorithms, and prepare for
                technical interviews all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" href="#editor">
                  Start Coding <ArrowRight />
                </Button>
                <Button size="lg" variant="outline" href="#explore">
                  Explore Problems <ArrowRight />
                </Button>
              </div>
            </div>

            <div className="flex-1 w-full max-w-xl">
              <div className="rounded-lg border bg-card shadow-xl overflow-hidden">
                <div className="flex items-center gap-1 border-b bg-muted/50 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-error"></div>
                  <div className="h-3 w-3 rounded-full bg-warning"></div>
                  <div className="h-3 w-3 rounded-full bg-success"></div>
                  <div className="mx-auto text-sm font-medium">logiclab.js</div>
                </div>
                <div className="p-4 font-mono text-sm">
                  <div className="group flex">
                    <div className="w-5 text-muted-foreground">1</div>
                    <div>
                      <span className="text-info">function</span>{" "}
                      <span className="text-warning">solve</span>(
                      <span className="text-secondary">problem</span>) {"{"}
                    </div>
                  </div>
                  <div className="group flex">
                    <div className="w-5 text-muted-foreground">2</div>
                    <div className="pl-4">
                      <span className="text-info">const</span> solution ={" "}
                      <span className="text-warning">think</span>({`{`}
                      deeply: <span className="text-secondary">true</span>
                      {`}`});
                    </div>
                  </div>
                  <div className="group flex">
                    <div className="w-5 text-muted-foreground">3</div>
                    <div className="pl-4">
                      <span className="text-info">if</span> (solution.
                      <span className="text-secondary">isOptimal</span>) {"{"}
                    </div>
                  </div>
                  <div className="group flex">
                    <div className="w-5 text-muted-foreground">4</div>
                    <div className="pl-8">
                      <span className="text-info">return</span> solution;
                    </div>
                  </div>
                  <div className="group flex">
                    <div className="w-5 text-muted-foreground">5</div>
                    <div className="pl-4">
                      {"}"} <span className="text-info">else</span> {"{"}
                    </div>
                  </div>
                  <div className="group flex">
                    <div className="w-5 text-muted-foreground">6</div>
                    <div className="pl-8">
                      <span className="text-info">return</span>{" "}
                      <span className="text-warning">refactor</span>
                      (solution);
                    </div>
                  </div>
                  <div className="group flex">
                    <div className="w-5 text-muted-foreground">7</div>
                    <div className="pl-4">{"}"}</div>
                  </div>
                  <div className="group flex">
                    <div className="w-5 text-muted-foreground">8</div>
                    <div>{"}"}</div>
                  </div>
                  <div className="group flex mt-2 animate-pulse">
                    <div className="w-5 text-muted-foreground">9</div>
                    <div className="h-5 w-2 bg-primary"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editor Section */}
        <section id="editor" className="py-12 bg-background">
          <EditorPanel showAiAssist={true} />
        </section>

        {/* Features Tabs Section */}
        <section id="explore" className="py-12">
          <div className="flex flex-col gap-4 mb-8">
            <h2 className="text-3xl font-bold">Explore the Platform</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover coding problems, collections, and resources to improve
              your skills.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid md:grid-cols-3 grid-cols-1 md:w-[400px] w-full">
              <TabsTrigger
                value="playground"
                className="flex items-center gap-2"
              >
                <Code className="h-4 w-4" />
                <span>Playground</span>
              </TabsTrigger>
              <TabsTrigger value="problems" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Problems</span>
              </TabsTrigger>
              <TabsTrigger
                value="collections"
                className="flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                <span>Collections</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="playground" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <Code className="size-5" />
                    <h3 className="text-xl">Code Editor</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Full-featured code editor with syntax highlighting,
                    auto-completion, and multi-language support.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <Code2 className="size-5" />
                    <h3 className="text-xl">Run Code</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Execute your code in the browser and see instant results
                    with detailed output.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <Brain className="size-5" />
                    <h3 className="text-xl">AI Assistance</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Get AI-powered help with your code, including code
                    explanations and optimization tips.
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <Button className="mt-4" size="lg" href="#editor">
                  Try the Playground <ArrowRight />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="problems" className="min-h-[400px]">
              <div className="flex justify-end mb-4">
                <Button variant="link" size="sm" href="/problems">
                  View All Problems <ArrowRight />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredProblems?.map((problem: Problem) => (
                  <ProblemCard key={problem.id} problem={problem} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="collections" className="min-h-[400px]">
              <div className="flex justify-end mb-4">
                <Button variant="link" size="sm" href="/collections">
                  View All Collections <ArrowRight />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredCollections?.map((collection: Collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-background">
          <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background border shadow-sm p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <h3 className="text-4xl font-bold">500+</h3>
                <p className="text-muted-foreground">Coding Problems</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold">50+</h3>
                <p className="text-muted-foreground">Collections</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold">10k+</h3>
                <p className="text-muted-foreground">Active Users</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold">1M+</h3>
                <p className="text-muted-foreground">Submissions</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
