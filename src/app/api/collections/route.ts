import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
import { Collection } from "@/lib/db/models/collection.model";
import { createValidator } from "@/lib/validator";
import { getCollectionsQuerySchema, createCollectionSchema } from "./schemas";

const CURRENT_USER_ID = "666666666666666666666666";

const validateGetCollections = createValidator(getCollectionsQuerySchema, "query");
const validateCreateCollection = createValidator(createCollectionSchema, "body");

export const GET = apiHandler(async (request: NextRequest) => {
  const validatedParams = await validateGetCollections(request);
  let query = Collection.find();

  if (validatedParams?.search) {
    const searchTerm = validatedParams.search.toLowerCase();
    query = query.or([{ title: { $regex: searchTerm, $options: "i" } }, { description: { $regex: searchTerm, $options: "i" } }, { tags: { $in: [new RegExp(searchTerm, "i")] } }]);
  }

  if (validatedParams?.tags && validatedParams.tags.length > 0) {
    query = query.where("tags").in(validatedParams.tags);
  }

  if (validatedParams?.myCollections) {
    query = query.where("createdBy", CURRENT_USER_ID);
  }

  if (validatedParams?.featured !== undefined) {
    query = query.where("isFeatured", validatedParams.featured);
  }

  if (validatedParams?.sortBy) {
    switch (validatedParams.sortBy) {
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
      case "completion_rate":
        query = query.sort({ completionCount: -1 });
        break;
      default:
        break;
    }
  }

  const collections = await query.exec();

  return { data: collections, status: StatusCodes.OK };
});

export const POST = apiHandler(async (request: NextRequest) => {
  const validatedData = await validateCreateCollection(request);

  const newCollection = await Collection.create({
    ...validatedData,
    createdBy: CURRENT_USER_ID,
    description: validatedData.description || `Collection for ${validatedData.title}`,
    slug: validatedData.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^a-z0-9-]/g, ""),
  });

  return { data: newCollection, status: StatusCodes.CREATED };
});
