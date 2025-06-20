import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
import { auth0 } from "@/lib/auth0";
import { Problem } from "@/lib/db/models/problem.model";
import { NotFoundException } from "@/lib/exceptions";

export const GET = apiHandler(async (_, params: Promise<{ id: string }>) => {
  const { id } = await params;

  const session = await auth0.getSession();
  const userId = session?.user?.id;

  const problem = await Problem.findOne({
    _id: id,
    $or: [{ createdBy: userId }, { isPublic: true }],
  });

  if (!problem) {
    throw new NotFoundException("Problem not found");
  }

  return { data: problem, status: StatusCodes.OK };
});
