import { apiHandler } from "@/lib/errorHandler";

import { StatusCodes } from "@/constants/statusCodes";
import { Problem } from "@/lib/db/models/problem.model";
import { NotFoundException } from "@/lib/exceptions";
import { auth0 } from "@/lib/auth0";

export const GET = apiHandler(async (_, params: Promise<{ slug: string }>) => {
  const { slug } = await params;
  const session = await auth0.getSession();
  const userId = session?.user?.id;

  const problem = await Problem.findOne({
    slug,
    $or: [{ createdBy: userId }, { isPublic: true }],
  });

  if (!problem) {
    throw new NotFoundException("Problem not found");
  }

  return { data: problem, status: StatusCodes.OK };
});
