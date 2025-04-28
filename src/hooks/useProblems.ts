import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IProblem,
  IProblemFilters,
  ProgrammingLanguage,
  IProblemCreateInput,
} from "@/types";
import { toast } from "sonner";
import * as problemsAPI from "@/lib/api/problems";
import * as usersAPI from "@/lib/api/users";
import { aiProblemCreator } from "@/lib/ai/problemCreator";

const CURRENT_USER_ID = "user123";

export function useProblems() {
  const queryClient = useQueryClient();

  // Fetch all problems (with optional filters)
  const useAllProblems = (filters?: IProblemFilters) => {
    return useQuery({
      queryKey: ["problems", filters],
      queryFn: async () => {
        const problems = await problemsAPI.fetchProblems(filters);
        console.log(problems, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

        return problems;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Fetch a single problem by ID
  const useProblem = (id: string | undefined) => {
    return useQuery({
      queryKey: ["problem", id],
      queryFn: () => problemsAPI.fetchProblemById(id || ""),
      enabled: !!id,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Fetch featured problems
  const useFeaturedProblems = () => {
    return useQuery({
      queryKey: ["problems", "featured"],
      queryFn: problemsAPI.fetchFeaturedProblems,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Fetch a random problem
  const useRandomProblem = () => {
    return useQuery({
      queryKey: ["problem", "random"],
      queryFn: problemsAPI.fetchRandomProblem,
      staleTime: 0, // Always refetch
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    });
  };

  // Create a new problem
  const useCreateProblem = () => {
    return useMutation({
      mutationFn: async (input: IProblemCreateInput) => {
        const problem = aiProblemCreator(input);
        return problemsAPI.createProblem({
          ...problem,
          createdBy: CURRENT_USER_ID,
          completionCount: 0,
          popularity: 0,
          difficulty: input.difficulty,
          slug: problem.title.toLowerCase().replace(/ /g, "-"),
        });
      },
      onSuccess: (newProblem: IProblem) => {
        // Invalidate the problems list query to include the new problem
        queryClient.invalidateQueries({ queryKey: ["problems"] });
        toast.success("Problem created successfully!");
      },
      onError: (error: unknown) => {
        toast.error("Failed to create problem");
        console.error("Error creating problem:", error);
      },
    });
  };

  // Update a problem's user code
  const useUpdateProblemCode = () => {
    return useMutation({
      mutationFn: ({
        problemId,
        code,
        language,
      }: {
        problemId: string;
        code: string;
        language: ProgrammingLanguage;
      }) =>
        problemsAPI.updateProblemCode(
          CURRENT_USER_ID,
          problemId,
          code,
          language
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", "progress"] });
        toast.success("Code saved successfully!");
      },
      onError: (error: unknown) => {
        toast.error("Failed to save code");
        console.error("Error saving code:", error);
      },
    });
  };

  // Get user progress for a specific problem
  const getUserProblemProgress = useCallback(async (problemId: string) => {
    try {
      const progress = await usersAPI.getUserProblemProgress(
        CURRENT_USER_ID,
        problemId
      );
      return progress;
    } catch (error) {
      console.error("Error getting problem progress:", error);
      return null;
    }
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
