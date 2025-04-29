import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { DifficultyEnum, IProblem } from "@/types";
import { useProblems } from "@/hooks/useProblems";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { SearchInput } from "../ui/search-input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProblemSelectorProps {
  currentProblemSlug?: string;
}

export function ProblemSelector() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { useProblem, useAllProblems } = useProblems();
  const collection = searchParams.get("collection") as string;
  const currentProblemSlug = params.slug as string;
  const { data: allProblems } = useAllProblems({ collectionSlug: collection });

  useEffect(() => {
    if (collection) {
      console.log("Collection from params:", collection);
    }
  }, [collection]);

  const { data: currentProblem, isLoading } = useProblem(currentProblemSlug);
  const [search, setSearch] = useState("");

  // Filter problems based on search
  const filteredProblems = allProblems?.filter((problem) => problem.title.toLowerCase().includes(search.toLowerCase()) || problem.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())));

  // Handle problem selection
  const handleSelect = (slug: string) => {
    router.push(`/playground/${slug}`);
  };

  // Get difficulty badge style
  const getDifficultyBadge = (difficulty: DifficultyEnum) => {
    switch (difficulty) {
      case DifficultyEnum.EASY:
        return "success";
      case DifficultyEnum.MEDIUM:
        return "warning";
      case DifficultyEnum.HARD:
        return "error";
      default:
        return "muted";
    }
  };

  return (
    <Drawer direction="left">
      <DrawerTrigger>
        <Button variant="outline" className="w-64 justify-between" disabled={isLoading}>
          {currentProblem ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="truncate">{currentProblem.title}</span>
              <Badge variant={getDifficultyBadge(currentProblem.difficulty)}>{currentProblem.difficulty}</Badge>
            </div>
          ) : (
            "Select problem..."
          )}
          <ChevronsUpDown className="ml-2 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select a Problem</DrawerTitle>
        </DrawerHeader>
        <div className="px-2">
          <SearchInput autoFocus placeholder="Search problems..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-2" />
          <ScrollArea className="h-[80vh]">
            {filteredProblems?.map((problem) => (
              <div key={problem.id} className="flex justify-between p-2 hover:bg-muted cursor-pointer rounded" onClick={() => handleSelect(problem.slug)}>
                <div className="flex flex-col">
                  <span>{problem.title}</span>
                  <span className="text-xs text-muted-foreground">{problem.tags.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getDifficultyBadge(problem.difficulty)}>{problem.difficulty}</Badge>
                  {problem.slug === currentProblemSlug && <Check className="h-4 w-4" />}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ProblemSelector;
