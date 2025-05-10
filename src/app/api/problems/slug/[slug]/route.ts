import { apiHandler } from "@/lib/errorHandler";

import { StatusCodes } from "@/constants/statusCodes";
import { Problem } from "@/lib/db/models/problem.model";
import { NotFoundException } from "@/lib/exceptions";

const CURRENT_USER_ID = "666666666666666666666666";
const ADMIN_USER_ID = "user123";

export const GET = apiHandler(async (_, params: Promise<{ slug: string }>) => {
  const { slug } = await params;
  const problem = await Problem.findOne({
    slug,
    $or: [{ createdBy: ADMIN_USER_ID }, { createdBy: CURRENT_USER_ID }],
  });

  if (!problem) {
    throw new NotFoundException("Problem not found");
  }

  return { data: problem, status: StatusCodes.OK };
});
