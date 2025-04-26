import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Problem,
  ProblemFilters,
  ProgrammingLanguage,
  UserProblemProgress,
} from "@/types";
import { PROBLEMS } from "@/data/mock/problems";
import { CURRENT_USER } from "@/data/mock/users";
import { toast } from "sonner";

// Simulate API endpoints with mock data

// Fetch all problems (with optional filters)
const fetchProblems = async (filters?: ProblemFilters): Promise<Problem[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredProblems = [...PROBLEMS];

  // Apply filters (if provided)
  if (filters) {
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProblems = filteredProblems.filter(
        (problem) =>
          problem.title.toLowerCase().includes(searchTerm) ||
          problem.description.toLowerCase().includes(searchTerm) ||
          problem.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      filteredProblems = filteredProblems.filter((problem) =>
        filters.categories!.some(
          (category) =>
            problem.category.toLowerCase() === category.toLowerCase()
        )
      );
    }

    // Filter by difficulties
    if (filters.difficulties && filters.difficulties.length > 0) {
      filteredProblems = filteredProblems.filter((problem) =>
        filters.difficulties!.includes(problem.difficulty)
      );
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filteredProblems = filteredProblems.filter((problem) =>
        filters.tags!.some((tag) => problem.tags.includes(tag))
      );
    }

    // Filter by problem status (requires user data)
    if (filters.status && filters.status.length > 0) {
      filteredProblems = filteredProblems.filter((problem) => {
        const userProgress = CURRENT_USER.problemsProgress[problem.id];
        if (!userProgress) return filters.status!.includes("not_started");
        return filters.status!.includes(userProgress.status);
      });
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredProblems.sort((a, b) => {
        switch (filters.sortBy) {
          case "popularity":
            return b.popularity - a.popularity;
          case "newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "title":
            return a.title.localeCompare(b.title);
          case "difficulty":
            const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
            return (
              difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
              difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
            );
          case "completion_rate":
            return (
              b.completionCount / b.popularity -
              a.completionCount / a.popularity
            );
          default:
            return 0;
        }
      });
    }
  }

  return filteredProblems;
};

// Fetch a single problem by ID
const fetchProblemById = async (id: string): Promise<Problem | null> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const problem = PROBLEMS.find((p) => p.id === id);
  return problem || null;
};

// Get featured problems
const fetchFeaturedProblems = async (): Promise<Problem[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  return PROBLEMS.filter((problem) => problem.isFeatured);
};

// Get random problem
const fetchRandomProblem = async (): Promise<Problem> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const randomIndex = Math.floor(Math.random() * PROBLEMS.length);
  return PROBLEMS[randomIndex];
};

// Create a new problem (mock implementation)
const createProblem = async (
  problem: Omit<Problem, "id" | "createdAt" | "updatedAt">
): Promise<Problem> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate a new problem with ID and timestamps
  const newProblem: Problem = {
    ...problem,
    id: `problem-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    popularity: 0,
    completionCount: 0,
    isFeatured: false,
  };

  return newProblem;
};

// Update a problem's user code
const updateProblemCode = async ({
  problemId,
  code,
  language,
}: {
  problemId: string;
  code: string;
  language: ProgrammingLanguage;
}): Promise<boolean> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // In a real app, this would update the user's saved code for this problem
  return true;
};
export function useProblems() {
  const queryClient = useQueryClient();

  // Fetch all problems (with optional filters)
  const useAllProblems = (filters?: ProblemFilters) => {
    return useQuery({
      queryKey: ["problems", filters],
      queryFn: () => fetchProblems(filters),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Fetch a single problem by ID
  const useProblem = (id: string | undefined) => {
    return useQuery({
      queryKey: ["problem", id],
      queryFn: () => fetchProblemById(id || ""),
      enabled: !!id,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Fetch featured problems
  const useFeaturedProblems = () => {
    return useQuery({
      queryKey: ["problems", "featured"],
      queryFn: fetchFeaturedProblems,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Fetch a random problem
  const useRandomProblem = () => {
    return useQuery({
      queryKey: ["problem", "random"],
      queryFn: fetchRandomProblem,
      staleTime: 0, // Always refetch
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    });
  };

  // Create a new problem
  const useCreateProblem = () => {
    return useMutation({
      mutationFn: createProblem,
      onSuccess: (newProblem: Problem) => {
        // Invalidate the problems list query to include the new problem
        queryClient.invalidateQueries({ queryKey: ["problems"] });
        toast.success("Problem created successfully!");
      },
      onError: (error: unknown) => {
        toast.error("Failed to create problem");
      },
    });
  };

  // Update a problem's user code
  const useUpdateProblemCode = () => {
    return useMutation({
      mutationFn: updateProblemCode,
      onSuccess: () => {
        toast.success("Code saved successfully!");
      },
      onError: () => {
        toast.error("Failed to save code");
      },
    });
  };

  // Get user progress for a specific problem
  const getUserProblemProgress = useCallback((problemId: string) => {
    return CURRENT_USER.problemsProgress[problemId];
  }, []);

  const allProblemsQuery = useAllProblems();
  const featuredProblemsQuery = useFeaturedProblems();
  const randomProblemQuery = useRandomProblem();
  const createProblemMutation = useCreateProblem();
  const updateProblemCodeMutation = useUpdateProblemCode();

  return {
    useAllProblems,
    useProblem,
    useFeaturedProblems,
    useRandomProblem,
    useCreateProblem,
    useUpdateProblemCode,
    getUserProblemProgress,

    createProblem: createProblemMutation.mutateAsync,
    updateProblemCode: updateProblemCodeMutation.mutateAsync,
    isCreatingProblem: createProblemMutation.isPending,
    isUpdatingProblemCode: updateProblemCodeMutation.isPending,

    allProblems: allProblemsQuery.data,
    isAllProblemsLoading: allProblemsQuery.isLoading,
    featuredProblems: featuredProblemsQuery.data,
    isFeaturedProblemsLoading: featuredProblemsQuery.isLoading,
    randomProblem: randomProblemQuery.data,
    isRandomProblemLoading: randomProblemQuery.isLoading,
  };
}

export default useProblems;
