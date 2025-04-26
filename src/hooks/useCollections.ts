import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Collection, CollectionFilters, Problem } from "@/types";
import { COLLECTIONS } from "@/data/mock/collections";
import { PROBLEMS } from "@/data/mock/problems";
import { toast } from "sonner";

// Simulate API endpoints with mock data

// Fetch all collections (with optional filters)
const fetchCollections = async (
  filters?: CollectionFilters
): Promise<Collection[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredCollections = [...COLLECTIONS];

  // Apply filters (if provided)
  if (filters) {
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredCollections = filteredCollections.filter(
        (collection) =>
          collection.title.toLowerCase().includes(searchTerm) ||
          collection.description.toLowerCase().includes(searchTerm) ||
          collection.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filteredCollections = filteredCollections.filter((collection) =>
        filters.tags!.some((tag) => collection.tags.includes(tag))
      );
    }

    // Filter by creator
    if (filters.createdBy) {
      filteredCollections = filteredCollections.filter(
        (collection) => collection.createdBy === filters.createdBy
      );
    }

    // Filter by featured status
    if (filters.featured !== undefined) {
      filteredCollections = filteredCollections.filter(
        (collection) => collection.isFeatured === filters.featured
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredCollections.sort((a, b) => {
        switch (filters.sortBy) {
          case "popularity":
            return b.completionCount - a.completionCount;
          case "newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "title":
            return a.title.localeCompare(b.title);
          case "difficulty":
            const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
            return a.difficulty && b.difficulty
              ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
              : 0;
          default:
            return 0;
        }
      });
    }
  }

  return filteredCollections;
};

// Fetch a single collection by ID
const fetchCollectionById = async (id: string): Promise<Collection | null> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const collection = COLLECTIONS.find((c) => c.id === id);

  if (!collection) return null;

  // Populate problems array based on problemIds
  const problems = PROBLEMS.filter((p) => collection.problemIds.includes(p.id));

  return {
    ...collection,
    problems,
  };
};

// Fetch featured collections
const fetchFeaturedCollections = async (): Promise<Collection[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  return COLLECTIONS.filter((collection) => collection.isFeatured).slice(0, 3);
};

// Create a new collection (mock implementation)
const createCollection = async (
  collection: Omit<
    Collection,
    "id" | "createdAt" | "updatedAt" | "completionCount"
  >
): Promise<Collection> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate a new collection with ID and timestamps
  const newCollection: Collection = {
    ...collection,
    id: `collection-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completionCount: 0,
  };

  return newCollection;
};

// Update a collection
const updateCollection = async (
  collection: Collection
): Promise<Collection> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, this would update the collection in the database
  return {
    ...collection,
    updatedAt: new Date().toISOString(),
  };
};

export function useCollections() {
  const queryClient = useQueryClient();

  // Fetch all collections (with optional filters)
  const useAllCollections = (filters?: CollectionFilters) => {
    return useQuery({
      queryKey: ["collections", filters],
      queryFn: () => fetchCollections(filters),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Fetch a single collection by ID
  const useCollection = (id: string | undefined) => {
    return useQuery({
      queryKey: ["collection", id],
      queryFn: () => fetchCollectionById(id || ""),
      enabled: !!id,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Fetch featured collections
  const useFeaturedCollections = () => {
    return useQuery({
      queryKey: ["collections", "featured"],
      queryFn: fetchFeaturedCollections,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Create a new collection
  const useCreateCollection = () => {
    return useMutation({
      mutationFn: createCollection,
      onSuccess: (newCollection) => {
        // Invalidate the collections list query to include the new collection
        queryClient.invalidateQueries({ queryKey: ["collections"] });
        toast.success("Collection created successfully!");
      },
      onError: (error) => {
        toast.error("Failed to create collection");
      },
    });
  };

  // Update a collection
  const useUpdateCollection = () => {
    return useMutation({
      mutationFn: updateCollection,
      onSuccess: (updatedCollection) => {
        // Invalidate the specific collection query and the collections list
        queryClient.invalidateQueries({
          queryKey: ["collection", updatedCollection.id],
        });
        queryClient.invalidateQueries({ queryKey: ["collections"] });
        toast.success("Collection updated successfully!");
      },
      onError: (error) => {
        toast.error("Failed to update collection");
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
