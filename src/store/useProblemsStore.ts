import { create } from "zustand";
import { useEffect, useCallback } from "react";
import { useAllProblems, useFeaturedProblems, useRandomProblem, useCreateProblem, useUpdateProblemCode } from "@/hooks/useProblems";
import { IAiProblemCreateInput, IProblem, IProblemFilters } from "@/types/problems";
import { ProgrammingLanguageEnum } from "@/types/enums";
import { noop } from "@/lib/utils";
import * as usersAPI from "@/lib/api/users";

const CURRENT_USER_ID = "user123";

interface IProblemsStore {
  // Problems data
  allProblems: IProblem[] | null;
  isAllProblemsLoading: boolean;
  isAllProblemsError: boolean;
  allProblemsError: Error | null;

  featuredProblems: IProblem[] | null;
  isFeaturedProblemsLoading: boolean;
  isFeaturedProblemsError: boolean;
  featuredProblemsError: Error | null;

  randomProblem: IProblem | null;
  isRandomProblemLoading: boolean;
  isRandomProblemError: boolean;
  randomProblemError: Error | null;

  // Actions
  createProblem: (input: IAiProblemCreateInput) => Promise<IProblem>;
  isCreatingProblem: boolean;
  isCreateProblemError: boolean;
  createProblemError: Error | null;

  updateProblemCode: (params: { problemId: string; code: string; language: ProgrammingLanguageEnum }) => Promise<any>;
  isUpdatingProblemCode: boolean;
  isUpdateProblemCodeError: boolean;
  updateProblemCodeError: Error | null;

  // User problem progress
  getUserProblemProgress: (problemId: string) => Promise<any>;

  // Filters
  currentFilters: IProblemFilters | null;
  setFilters: (filters: IProblemFilters) => void;
}

// Create the store without implementing the functions yet
export const useProblemsStore = create<IProblemsStore>((set, get) => ({
  // Problems data
  allProblems: null,
  isAllProblemsLoading: false,
  isAllProblemsError: false,
  allProblemsError: null,

  featuredProblems: null,
  isFeaturedProblemsLoading: false,
  isFeaturedProblemsError: false,
  featuredProblemsError: null,

  randomProblem: null,
  isRandomProblemLoading: false,
  isRandomProblemError: false,
  randomProblemError: null,

  // Actions
  createProblem: async () => ({ id: "", title: "", description: "", difficulty: "easy" } as IProblem),
  isCreatingProblem: false,
  isCreateProblemError: false,
  createProblemError: null,

  updateProblemCode: async () => null,
  isUpdatingProblemCode: false,
  isUpdateProblemCodeError: false,
  updateProblemCodeError: null,

  // User problem progress
  getUserProblemProgress: async (problemId: string) => {
    try {
      const progress = await usersAPI.getUserProblemProgress(CURRENT_USER_ID, problemId);
      return progress;
    } catch (error) {
      console.error("Error getting problem progress:", error);
      return null;
    }
  },

  // Filters
  currentFilters: null,
  setFilters: (filters: IProblemFilters) => {
    set({ currentFilters: filters });
  },
}));

// Hook to initialize the store with problems data
export function useInitializeProblemsStore(filters?: IProblemFilters) {
  const allProblemsQuery = useAllProblems(filters || useProblemsStore.getState().currentFilters || undefined);
  const featuredProblemsQuery = useFeaturedProblems();
  const randomProblemQuery = useRandomProblem();
  const createProblemMutation = useCreateProblem();
  const updateProblemCodeMutation = useUpdateProblemCode();

  // Update store with all problems data
  useEffect(() => {
    useProblemsStore.setState({
      allProblems: allProblemsQuery.data || [],
      isAllProblemsLoading: allProblemsQuery.isLoading,
      isAllProblemsError: allProblemsQuery.isError,
      allProblemsError: allProblemsQuery.error as Error | null,
    });
  }, [allProblemsQuery.data, allProblemsQuery.isLoading, allProblemsQuery.isError, allProblemsQuery.error]);

  // Update store with featured problems data
  useEffect(() => {
    useProblemsStore.setState({
      featuredProblems: featuredProblemsQuery.data || [],
      isFeaturedProblemsLoading: featuredProblemsQuery.isLoading,
      isFeaturedProblemsError: featuredProblemsQuery.isError,
      featuredProblemsError: featuredProblemsQuery.error as Error | null,
    });
  }, [featuredProblemsQuery.data, featuredProblemsQuery.isLoading, featuredProblemsQuery.isError, featuredProblemsQuery.error]);

  // Update store with random problem data
  useEffect(() => {
    useProblemsStore.setState({
      randomProblem: randomProblemQuery.data || null,
      isRandomProblemLoading: randomProblemQuery.isLoading,
      isRandomProblemError: randomProblemQuery.isError,
      randomProblemError: randomProblemQuery.error as Error | null,
    });
  }, [randomProblemQuery.data, randomProblemQuery.isLoading, randomProblemQuery.isError, randomProblemQuery.error]);

  // Update store with create problem mutation
  useEffect(() => {
    useProblemsStore.setState({
      createProblem: createProblemMutation.mutateAsync,
      isCreatingProblem: createProblemMutation.isPending,
      isCreateProblemError: createProblemMutation.isError,
      createProblemError: createProblemMutation.error as Error | null,
    });
  }, [createProblemMutation.mutateAsync, createProblemMutation.isPending, createProblemMutation.isError, createProblemMutation.error]);

  // Update store with update problem code mutation
  useEffect(() => {
    useProblemsStore.setState({
      updateProblemCode: updateProblemCodeMutation.mutateAsync,
      isUpdatingProblemCode: updateProblemCodeMutation.isPending,
      isUpdateProblemCodeError: updateProblemCodeMutation.isError,
      updateProblemCodeError: updateProblemCodeMutation.error as Error | null,
    });
  }, [updateProblemCodeMutation.mutateAsync, updateProblemCodeMutation.isPending, updateProblemCodeMutation.isError, updateProblemCodeMutation.error]);
}
