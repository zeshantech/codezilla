import { getProblemById } from "../helpers";
import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";

export const GET = apiHandler(async (_, params: Promise<{ id: string }>) => {
  const { id } = await params;
  const problem = await getProblemById(id);

  return { data: problem, status: StatusCodes.OK };
});
