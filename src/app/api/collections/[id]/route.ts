import { NextRequest } from "next/server";
import { Collection } from "@/lib/db/models/collection.model";
import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
import { updateCollectionSchema } from "@/app/api/collections/schemas";
import { createValidator } from "@/lib/validator";

const validateUpdateCollection = createValidator(
  updateCollectionSchema,
  "body"
);

export const GET = apiHandler(async (_, params: { id: string }) => {
  const { id } = params;
  const collection = await Collection.findById(id).populate({
    path: "problems",
    select: "title slug difficulty description",
  });
  if (!collection) {
    throw new Error("Collection not found");
  }

  return { data: collection, status: StatusCodes.OK };
});

export const PUT = apiHandler(
  async (request: NextRequest, params: { id: string }) => {
    const { id } = params;
    const validatedData = await validateUpdateCollection(request);

    const updatedCollection = await Collection.findByIdAndUpdate(
      id,
      {
        title: validatedData.title,
        description: validatedData.description,
        problemIdz: validatedData.problemIdz,
        isPublic: validatedData.isPublic,
        difficulty: validatedData.difficulty,
        tags: validatedData.tags,
        isFeatured: validatedData.isFeatured,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCollection) {
      throw new Error("Collection not found");
    }

    return { data: updatedCollection, status: StatusCodes.OK };
  }
);

export const DELETE = apiHandler(
  async (_: NextRequest, params: { id: string }) => {
    const { id } = params;
    const deletedCollection = await Collection.findByIdAndDelete(id);

    if (!deletedCollection) {
      throw new Error("Collection not found");
    }

    return { data: deletedCollection, status: StatusCodes.OK };
  }
);
