import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IAiProblemCreateInput, IProblemFilters } from "@/types/problems";
import { toast } from "sonner";
import * as problemsAPI from "@/lib/api/problems";
import * as usersAPI from "@/lib/api/users";
import { aiProblemCreator } from "@/lib/ai/problemCreator";
import { ProgrammingLanguageEnum } from "@/types/enums";

export const useAllProblems = (filters?: IProblemFilters) => {
  return useQuery({
    queryKey: ["problems", filters],
    queryFn: async () => {
      const problems = await problemsAPI.fetchProblems(filters);

      return problems;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useProblem = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["problem", slug],
    queryFn: () => problemsAPI.fetchProblemBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFeaturedProblems = () => {
  return useQuery({
    queryKey: ["problems", "featured"],
    queryFn: problemsAPI.fetchFeaturedProblems,
    staleTime: 1000 * 60 * 5,
    enabled: false,
  });
};

export const useRandomProblem = () => {
  return useQuery({
    queryKey: ["problem", "random"],
    queryFn: problemsAPI.fetchRandomProblem,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};

export const useCreateProblem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: IAiProblemCreateInput) => {
      const problem = await aiProblemCreator(input);
      return problemsAPI.createProblem({
        ...problem,
        difficulty: input.difficulty,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Problem created successfully!");
    },
    onError: (error: unknown) => {
      toast.error("Failed to create problem");
      console.error("Error creating problem:", error);
    },
  });
};

export const useUpdateProblemCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ problemId, code, language }: { problemId: string; code: string; language: ProgrammingLanguageEnum }) => problemsAPI.updateProblemCode(problemId, code, language),
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
