import dbConnect from "../db/connection";
import { Collection } from "../db/models/collection.model";
import { ICollection, ICollectionFilters } from "@/types";

// Fetch all collections (with optional filters)
export async function fetchCollections(
  filters?: ICollectionFilters
): Promise<ICollection[]> {
  await dbConnect();

  let query = Collection.find();

  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase();
    query = query.or([
      { title: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { tags: { $in: [new RegExp(searchTerm, "i")] } },
    ]);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.where("tags").in(filters.tags);
  }

  if (filters?.createdBy) {
    query = query.where("createdBy", filters.createdBy);
  }

  if (filters?.featured !== undefined) {
    query = query.where("isFeatured", filters.featured);
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case "popularity":
        query = query.sort({ completionCount: -1 });
        break;
      case "newest":
        query = query.sort({ createdAt: -1 });
        break;
      case "title":
        query = query.sort({ title: 1 });
        break;
      case "difficulty":
        query = query.sort({ difficulty: 1 });
        break;
      default:
        break;
    }
  }

  const collections = await query.exec();
  return collections;
}

// Fetch a single collection by ID with populated problems
export async function fetchCollectionById(
  id: string
): Promise<ICollection | null> {
  await dbConnect();
  try {
    const collection = await Collection.findById(id).populate("problems");

    return collection;
  } catch (error) {
    console.error("Error fetching collection:", error);
    return null;
  }
}

// Fetch featured collections
export async function fetchFeaturedCollections(): Promise<ICollection[]> {
  await dbConnect();

  const collections = await Collection.find({ isFeatured: true });
  return collections;
}

export async function createCollection(
  collection: Omit<
    ICollection,
    "id" | "createdAt" | "updatedAt" | "completionCount"
  >
): Promise<ICollection> {
  await dbConnect();

  const newCollection = new Collection({
    ...collection,
    completionCount: 0,
  });

  await newCollection.save();
  return newCollection;
}

// Update a collection
export async function updateCollection(
  collection: ICollection
): Promise<ICollection> {
  await dbConnect();

  const updatedCollection = await Collection.findByIdAndUpdate(
    collection.id,
    {
      title: collection.title,
      slug: collection.slug,
      description: collection.description,
      problems: collection.problems,
      isPublic: collection.isPublic,
      difficulty: collection.difficulty,
      tags: collection.tags,
    },
    { new: true, runValidators: true }
  );

  if (!updatedCollection) {
    throw new Error("Collection not found");
  }

  return updatedCollection;
}
