import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ICollection, ICollectionFilters } from "@/types";
import { toast } from "sonner";
import * as collectionsAPI from "@/lib/api/collections";

const CURRENT_USER_ID = "user123";

export function useCollections() {
  const queryClient = useQueryClient();

  const useAllCollections = (filters?: ICollectionFilters) => {
    return useQuery({
      queryKey: ["collections", filters],
      queryFn: () => collectionsAPI.fetchCollections(filters),
      staleTime: 1000 * 60 * 5,
    });
  };

  const useCollection = (id: string | undefined) => {
    return useQuery({
      queryKey: ["collection", id],
      queryFn: () => collectionsAPI.fetchCollectionById(id || ""),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    });
  };

  const useFeaturedCollections = () => {
    return useQuery({
      queryKey: ["collections", "featured"],
      queryFn: collectionsAPI.fetchFeaturedCollections,
      staleTime: 1000 * 60 * 5,
    });
  };

  const useCreateCollection = () => {
    return useMutation({
      mutationFn: (
        collection: Omit<
          ICollection,
          "id" | "createdAt" | "updatedAt" | "completionCount"
        >
      ) => {
        return collectionsAPI.createCollection({
          ...collection,
          createdBy: CURRENT_USER_ID,
        });
      },
      onSuccess: (newCollection) => {
        queryClient.invalidateQueries({ queryKey: ["collections"] });
        toast.success("Collection created successfully!");
      },
      onError: (error) => {
        toast.error("Failed to create collection");
        console.error("Error creating collection:", error);
      },
    });
  };

  const useUpdateCollection = () => {
    return useMutation({
      mutationFn: collectionsAPI.updateCollection,
      onSuccess: (updatedCollection) => {
        queryClient.invalidateQueries({
          queryKey: ["collection", updatedCollection.id],
        });
        queryClient.invalidateQueries({ queryKey: ["collections"] });
        toast.success("Collection updated successfully!");
      },
      onError: (error) => {
        toast.error("Failed to update collection");
        console.error("Error updating collection:", error);
      },
    });
  };

  const allCollectionsQuery = useAllCollections();
  const featuredCollectionsQuery = useFeaturedCollections();
  const createCollectionMutation = useCreateCollection();
  const updateCollectionMutation = useUpdateCollection();

  return {
    useAllCollections,
    useCollection,
    useFeaturedCollections,
    useCreateCollection,
    useUpdateCollection,

    createCollection: createCollectionMutation.mutateAsync,
    updateCollection: updateCollectionMutation.mutateAsync,
    isCreatingCollection: createCollectionMutation.isPending,
    isUpdatingCollection: updateCollectionMutation.isPending,

    allCollections: allCollectionsQuery.data,
    isAllCollectionsLoading: allCollectionsQuery.isLoading,
    featuredCollections: featuredCollectionsQuery.data,
    isFeaturedCollectionsLoading: featuredCollectionsQuery.isLoading,
  };
}

export default useCollections;
