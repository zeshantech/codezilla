import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
import { createValidator } from "@/lib/validator";
import { getCollectionsQuerySchema, createCollectionSchema } from "./schemas";
import { createCollection, fetchCollections } from "@/lib/api/collections";

const validateGetCollections = createValidator(
  getCollectionsQuerySchema,
  "query"
);
const validateCreateCollection = createValidator(
  createCollectionSchema,
  "body"
);

export const GET = apiHandler(async (request: NextRequest) => {
  const validatedParams = await validateGetCollections(request);
  const collections = await fetchCollections(validatedParams);

  return { data: collections, status: StatusCodes.OK };
});

export const POST = apiHandler(async (request: NextRequest) => {
  const validatedData = await validateCreateCollection(request);

  const newCollection = await createCollection({
    ...validatedData,
    slug:
      validatedData.slug ||
      validatedData.title.toLowerCase().replace(/ /g, "-"),
  });

  return { data: newCollection, status: StatusCodes.CREATED };
});
