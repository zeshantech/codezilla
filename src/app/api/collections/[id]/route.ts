import { NextRequest } from "next/server";
import { Collection } from "@/lib/db/models/collection.model";
import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
import { updateCollectionSchema } from "@/app/api/collections/schemas";
import { createValidator } from "@/lib/validator";

const CURRENT_USER_ID = "666666666666666666666666";

const validateUpdateCollection = createValidator(
  updateCollectionSchema,
  "body"
);

export const GET = apiHandler(async (_, params: { id: string }) => {
  const { id } = params;
  const collection = await Collection.findOne({
    _id: id,
    $or: [{ isPublic: true }, { createdBy: CURRENT_USER_ID }],
  }).populate({
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

    const updatedCollection = await Collection.findOneAndUpdate(
      { _id: id, createdBy: CURRENT_USER_ID },
      {
        title: validatedData.title,
        description: validatedData.description,
        problems: validatedData.problems,
        isPublic: validatedData.isPublic,
        difficulty: validatedData.difficulty,
        tags: validatedData.tags,
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
    const deletedCollection = await Collection.findOneAndDelete({
      _id: id,
      createdBy: CURRENT_USER_ID,
    });

    if (!deletedCollection) {
      throw new Error("Collection not found");
    }

    return { data: deletedCollection, status: StatusCodes.OK };
  }
);
