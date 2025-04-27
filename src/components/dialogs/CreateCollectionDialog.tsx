"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Search, PlusCircle, X, Check, Folder } from "lucide-react";
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
import { Selector } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useProblems } from "@/hooks/useProblems";
import { useCollections } from "@/hooks/useCollections";
import { Problem } from "@/types";

// Define the form schema with Zod
const createCollectionSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  difficulty: z.string().optional(),
  tags: z.string().optional(),
  isPublic: z.boolean().default(true),
  problemIds: z
    .array(z.string())
    .min(1, { message: "Please select at least one problem" }),
});

type CreateCollectionFormValues = z.infer<typeof createCollectionSchema>;

// Default values for the form
const defaultValues: Partial<CreateCollectionFormValues> = {
  isPublic: true,
  problemIds: [],
};

// Collection tags
const collectionTags = [
  "Beginner Friendly",
  "Top Interview Questions",
  "Algorithm Patterns",
  "Contest Prep",
  "System Design",
  "Database",
  "Frontend",
  "Backend",
  "Data Structures",
  "Company Specific",
  "Educational",
  "Weekly Challenge",
  "Coding Patterns",
];

export function CreateCollectionDialog() {
  const [open, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);

  // Fetch all problems to select from
  const { allProblems, isAllProblemsLoading } = useProblems();

  // Collection creation hook
  const { createCollection, isCreatingCollection } = useCollections();

  // Initialize the form
  const form = useForm<CreateCollectionFormValues>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues,
  });

  // Filter problems based on search term
  const filteredProblems = allProblems?.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Add/remove tags
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Toggle problem selection
  const toggleProblem = (problem: Problem) => {
    const isSelected = selectedProblems.some((p) => p.id === problem.id);

    if (isSelected) {
      setSelectedProblems(selectedProblems.filter((p) => p.id !== problem.id));
      // Update form value
      const currentIds = form.getValues().problemIds || [];
      form.setValue(
        "problemIds",
        currentIds.filter((id) => id !== problem.id)
      );
    } else {
      setSelectedProblems([...selectedProblems, problem]);
      // Update form value
      const currentIds = form.getValues().problemIds || [];
      form.setValue("problemIds", [...currentIds, problem.id]);
    }
  };

  // Handle form submission
  const onSubmit = async (data: CreateCollectionFormValues) => {
    await createCollection({
      ...data,
      tags: selectedTags,
    });

    // Reset form and close dialog on success
    form.reset(defaultValues);
    setSelectedTags([]);
    setSelectedProblems([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Folder className="mr-2 h-4 w-4" />
          Create Collection
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>
            Create a collection of problems for yourself or to share with the
            community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="title"
                label="Collection Title"
                placeholder="e.g., Top Dynamic Programming Problems"
                error={form.formState.errors.title?.message}
                {...form.register("title")}
              />
            </div>

            <div className="space-y-2">
              <Textarea
                id="description"
                label="Description"
                placeholder="Describe what this collection is about and who it's for..."
                className="min-h-[100px]"
                error={form.formState.errors.description?.message}
                {...form.register("description")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Selector
                  options={[
                    { label: "Easy", value: "Easy" },
                    { label: "Medium", value: "Medium" },
                    { label: "Hard", value: "Hard" },
                    { label: "Mixed", value: "Mixed" },
                    { label: "Progressive", value: "Progressive" },
                  ]}
                  label="Difficulty Level"
                  info="Overall difficulty of problems in this collection"
                  onChange={(value) => form.setValue("difficulty", value)}
                  defaultValue={form.getValues("difficulty")}
                  placeholder="Select difficulty"
                />
              </div>

              <div className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                <Checkbox
                  id="isPublic"
                  checked={form.watch("isPublic")}
                  onCheckedChange={(checked) =>
                    form.setValue("isPublic", checked as boolean)
                  }
                  label="Make this collection public"
                />
              </div>
            </div>
          </div>

          {/* Tags selection */}
          <div className="space-y-2">
            <div className="text-sm font-medium mb-2">Tags</div>
            <div className="border rounded-md p-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.length > 0 ? (
                  selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="ml-1 h-3 w-3 rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No tags selected
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1 pt-2 border-t">
                {collectionTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Problem selection */}
          <div className="space-y-2">
            <div className="text-sm font-medium">
              Select Problems
              <span className="ml-2 text-sm text-muted-foreground">
                (Selected: {selectedProblems.length})
              </span>
            </div>

            <div>
              <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    type="button"
                    error={form.formState.errors.problemIds?.message}
                  >
                    {selectedProblems.length > 0
                      ? `${selectedProblems.length} problems selected`
                      : "Search and select problems"}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search problems..."
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                    />
                    <CommandList>
                      <CommandEmpty>No problems found.</CommandEmpty>
                      <CommandGroup>
                        {isAllProblemsLoading ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : (
                          filteredProblems?.map((problem) => {
                            const isSelected = selectedProblems.some(
                              (p) => p.id === problem.id
                            );
                            return (
                              <CommandItem
                                key={problem.id}
                                value={problem.id}
                                onSelect={() => toggleProblem(problem)}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className={`flex-shrink-0 rounded-full p-1 ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "border"
                                  }`}
                                >
                                  {isSelected ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <PlusCircle className="h-3 w-3 opacity-50" />
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span>{problem.title}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {problem.difficulty} • {problem.category}
                                  </span>
                                </div>
                              </CommandItem>
                            );
                          })
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Selected problems list */}
            {selectedProblems.length > 0 && (
              <div className="border rounded-md mt-2">
                <ScrollArea className="h-[200px] w-full">
                  <div className="p-2 space-y-1">
                    {selectedProblems.map((problem, index) => (
                      <div
                        key={problem.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 flex items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{problem.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {problem.difficulty} • {problem.category}
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleProblem(problem)}
                          className="h-6 w-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" loading={isCreatingCollection}>
              Create Collection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCollectionDialog;
