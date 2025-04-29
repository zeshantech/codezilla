"use client";

import { useState } from "react";
import { Loader2, Sparkles, X, Info, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useProblems } from "@/hooks/useProblems";
import { Card, CardContent } from "@/components/ui/card";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DifficultyEnum } from "@/types";

// Programming topics/concepts
const programmingTopics = [
  "Arrays",
  "Strings",
  "Hash Tables",
  "Dynamic Programming",
  "Trees",
  "Graphs",
  "Sorting",
  "Searching",
  "Recursion",
  "Backtracking",
  "Greedy Algorithms",
  "Linked Lists",
  "Stacks",
  "Queues",
  "Binary Search",
  "Divide and Conquer",
  "Math",
  "Bit Manipulation",
  "Heaps",
  "Two Pointers",
];

// Difficulty options
const difficulties = [
  {
    value: "easy",
    label: "Easy",
    color: "success",
  },
  {
    value: "medium",
    label: "Medium",
    color: "warning",
  },
  {
    value: "hard",
    label: "Hard",
    color: "error",
  },
];

// Define the form schema with Zod
const formSchema = z.object({
  difficulty: z.string().transform((val) => val as DifficultyEnum),
  complexity: z.number().min(1).max(10),
  topics: z.array(z.string()).min(1, "Select at least one topic"),
  customPrompt: z.string().optional(),
  exampleCount: z.number().min(1).max(5),
  timeLimit: z.number().min(1).max(30),
  memoryLimit: z.number().min(8).max(512),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateProblemDialog() {
  const [open, setOpen] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const { createProblem, isCreatingProblem } = useProblems();

  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      difficulty: DifficultyEnum.MEDIUM,
      complexity: 5,
      topics: [],
      customPrompt: "",
      exampleCount: 2,
      timeLimit: 10,
      memoryLimit: 128,
    },
  });

  // Add/remove topic tags
  const toggleTopic = (topic: string) => {
    const currentTopics = getValues("topics");
    if (currentTopics.includes(topic)) {
      setValue(
        "topics",
        currentTopics.filter((t) => t !== topic),
        { shouldValidate: true }
      );
    } else {
      setValue("topics", [...currentTopics, topic], { shouldValidate: true });
    }
  };

  // Set difficulty
  const selectDifficulty = (value: string) => {
    const currentDifficulty = getValues("difficulty");
    setValue(
      "difficulty",
      value === currentDifficulty
        ? DifficultyEnum.MEDIUM
        : (value as DifficultyEnum),
      {
        shouldValidate: true,
      }
    );
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    const problemData = {
      difficulty: data.difficulty,
      complexity: data.complexity,
      topics: data.topics,
      customPrompt: data.customPrompt,
      exampleCount: data.exampleCount,
      timeLimit: data.timeLimit,
      memoryLimit: data.memoryLimit,
    };

    await createProblem(problemData);

    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Problem
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="mr-2 size-5" />
            Generate Problem with AI
          </DialogTitle>
          <DialogDescription>
            Our AI will generate a coding problem based on your specifications.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="text-sm font-medium leading-none">
                    Difficulty Level
                  </label>
                  {errors.difficulty && (
                    <span className="ml-2 text-sm text-error">
                      {errors.difficulty.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((diff) => (
                    <Badge
                      key={diff.value}
                      variant={
                        getValues("difficulty") === diff.value
                          ? (diff.color as any)
                          : "muted"
                      }
                      className="py-1 px-3 cursor-pointer"
                      onClick={() => selectDifficulty(diff.value)}
                    >
                      {diff.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none">
                    Complexity Level
                  </label>
                  <span className="text-sm font-medium">
                    {getValues("complexity")}/10
                  </span>
                </div>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[getValues("complexity")]}
                  onValueChange={(value) =>
                    setValue("complexity", value[0], { shouldValidate: true })
                  }
                  className="py-4"
                />
                <p className="text-xs text-muted-foreground">
                  Adjust how complex the generated problem should be
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none flex items-center">
              Topics
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select topics that should be covered in the problem</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <div className="border rounded-md p-3">
              <div className="flex flex-wrap gap-2 mb-2 min-h-8">
                {getValues("topics").length > 0 ? (
                  getValues("topics").map((topic) => (
                    <Badge
                      key={topic}
                      variant="secondary"
                      onClick={() => toggleTopic(topic)}
                      className="cursor-pointer"
                    >
                      {topic}
                    </Badge>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No topics selected
                  </div>
                )}
              </div>
              {errors.topics && (
                <div className="text-sm text-error mb-2">
                  {errors.topics.message}
                </div>
              )}
              <div className="flex flex-wrap gap-1 pt-2 border-t">
                {programmingTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant={
                      getValues("topics").includes(topic)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleTopic(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Collapsible open={advancedOptions} onOpenChange={setAdvancedOptions}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between px-4 py-2 border rounded-md hover:bg-muted/50"
                type="button"
              >
                <span className="font-medium">Advanced Options</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    advancedOptions ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-4 pt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label=" Example Count"
                      type="number"
                      info="Number of examples (1-5)"
                      min={1}
                      max={5}
                      {...register("exampleCount", { valueAsNumber: true })}
                      className="mt-1"
                    />

                    <Input
                      label="Time Limit (s)"
                      type="number"
                      min={1}
                      max={30}
                      {...register("timeLimit", { valueAsNumber: true })}
                      className="mt-1"
                    />

                    <Input
                      label="Memory Limit (MB)"
                      type="number"
                      min={8}
                      max={512}
                      {...register("memoryLimit", { valueAsNumber: true })}
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none flex items-center">
                      Custom AI Prompt
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[300px]">
                            <p>
                              Add specific requirements or guidance for the AI
                              when generating the problem.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Textarea
                      placeholder="Optional: Add specific requirements for the problem (e.g., 'Include a recursive approach' or 'Focus on space optimization')"
                      className="min-h-[80px]"
                      {...register("customPrompt")}
                    />
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" loading={isCreatingProblem}>
              Generate Problem
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProblemDialog;
