import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IUserProfileUpdate, IUserProblemProgress } from "@/types";
import * as userAPI from "@/lib/api/users";
import { toast } from "sonner";

// Mock current user ID (in a real app, this would come from your auth system)
const CURRENT_USER_ID = "user123";

export function useUser() {
  const queryClient = useQueryClient();

  // Get current user
  const useCurrentUser = () => {
    return useQuery({
      queryKey: ["user", "current"],
      queryFn: () => userAPI.fetchCurrentUser(CURRENT_USER_ID),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Update user profile
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: (profileUpdate: IUserProfileUpdate) =>
        userAPI.updateUserProfile(CURRENT_USER_ID, profileUpdate),
      onSuccess: () => {
        // Invalidate the current user query to reflect changes
        queryClient.invalidateQueries({ queryKey: ["user", "current"] });
        toast.success("Profile updated successfully!");
      },
      onError: (error) => {
        toast.error("Failed to update profile");
        console.error("Error updating profile:", error);
      },
    });
  };

  // Get user's problem progress
  const useProblemProgress = (problemId: string) => {
    return useQuery({
      queryKey: ["user", "progress", problemId],
      queryFn: () => userAPI.getUserProblemProgress(CURRENT_USER_ID, problemId),
      enabled: !!problemId,
      staleTime: 1000 * 60, // 1 minute
    });
  };

  // Update user's problem progress
  const useUpdateProblemProgress = () => {
    return useMutation({
      mutationFn: ({
        problemId,
        progress,
      }: {
        problemId: string;
        progress: Partial<IUserProblemProgress>;
      }) =>
        userAPI.updateUserProblemProgress(CURRENT_USER_ID, problemId, progress),
      onSuccess: (_, variables) => {
        // Invalidate specific problem progress and user data
        queryClient.invalidateQueries({
          queryKey: ["user", "progress", variables.problemId],
        });
        queryClient.invalidateQueries({ queryKey: ["user", "current"] });
        toast.success("Progress updated!");
      },
      onError: (error) => {
        toast.error("Failed to update progress");
        console.error("Error updating progress:", error);
      },
    });
  };

  // Initialize user data and hooks
  const currentUserQuery = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const updateProblemProgressMutation = useUpdateProblemProgress();

  return {
    // Queries
    useCurrentUser,
    useProblemProgress,

    // Mutations
    useUpdateProfile,
    useUpdateProblemProgress,

    // Data and loading states
    currentUser: currentUserQuery.data,
    isUserLoading: currentUserQuery.isLoading,

    // Direct mutation methods
    updateProfile: updateProfileMutation.mutateAsync,
    updateProblemProgress: updateProblemProgressMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingProgress: updateProblemProgressMutation.isPending,
  };
}

export default useUser;
