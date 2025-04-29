import { ICollection, ICollectionCreateInput, ICollectionFilters } from "@/types";
import api from "./api";

// Fetch all collections (with optional filters)
export async function fetchCollections(filters?: ICollectionFilters): Promise<ICollection[]> {
  const response = await api.get("/collections", { params: filters });
  return response.data;
}

// Fetch a single collection by ID with populated problems
export async function fetchCollectionById(id: string): Promise<ICollection> {
  const response = await api.get(`/collections/${id}`);

  return response.data;
}

// Fetch a single collection by slug with populated problems
export async function fetchCollectionBySlug(slug: string): Promise<ICollection> {
  const response = await api.get(`/collections/slug/${slug}`);
  return response.data;
}

// Fetch featured collections
export async function fetchFeaturedCollections(): Promise<ICollection[]> {
  const response = await api.get("/collections", { params: { featured: true } });
  return response.data;
}

export async function createCollection(collection: ICollectionCreateInput): Promise<ICollection> {
  const response = await api.post("/collections", collection);
  return response.data;
}

// Update a collection
export async function updateCollection(id: string, input: Partial<ICollectionCreateInput>): Promise<ICollection> {
  const response = await api.put(`/collections/${id}`, input);
  return response.data;
}

// Delete a collection
export async function deleteCollection(id: string): Promise<void> {
  await api.delete(`/collections/${id}`);
}
