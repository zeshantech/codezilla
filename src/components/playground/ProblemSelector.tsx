import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Filter } from "lucide-react";
import { Difficulty, Problem } from "@/types";
import { useProblems } from "@/hooks/useProblems";

interface ProblemSelectorProps {
  currentProblemSlug?: string;
}

export function ProblemSelector({ currentProblemSlug }: ProblemSelectorProps) {
  const router = useRouter();
  const { useProblem, allProblems } = useProblems();

  const { data: currentProblem, isLoading } = useProblem(currentProblemSlug);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter problems based on search
  const filteredProblems = allProblems?.filter(
    (problem) =>
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.tags.some((tag) =>
        tag.toLowerCase().includes(search.toLowerCase())
      )
  );

  // Handle problem selection
  const handleSelect = (slug: string) => {
    setOpen(false);
    router.push(`/playground/${slug}`);
  };

  // Get difficulty badge style
  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "success";
      case "Medium":
        return "warning";
      case "Hard":
        return "error";
      default:
        return "muted";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
          disabled={isLoading}
        >
          {currentProblem ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="truncate">{currentProblem.title}</span>
              <Badge variant={getDifficultyBadge(currentProblem.difficulty)}>
                {currentProblem.difficulty}
              </Badge>
            </div>
          ) : (
            "Select problem..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Search problems..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No problems found.</CommandEmpty>
            <CommandGroup>
              {filteredProblems?.map((problem) => (
                <CommandItem
                  key={problem.id}
                  value={problem.title}
                  onSelect={() => handleSelect(problem.slug)}
                  className="flex justify-between"
                >
                  <div className="flex flex-col">
                    <span>{problem.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {problem.tags.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getDifficultyBadge(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                    {problem.slug === currentProblemSlug && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ProblemSelector;
