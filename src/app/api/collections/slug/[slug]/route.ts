import { apiHandler } from "@/lib/errorHandler";

import { Collection } from "@/lib/db/models/collection.model";
import { StatusCodes } from "@/constants/statusCodes";

const CURRENT_USER_ID = "666666666666666666666666";

export const GET = apiHandler(async (_, params: { slug: string }) => {
  const { slug } = params;
  const collection = await Collection.findOne({
    slug,
    $or: [{ isPublic: true }, { createdBy: CURRENT_USER_ID }],
  }).populate({
    path: "problems",
    select: "title slug difficulty category description popularity completionCount isFeatured tags",
  });

  if (!collection) {
    throw new Error("Collection not found");
  }

  return { data: collection, status: StatusCodes.OK };
});
