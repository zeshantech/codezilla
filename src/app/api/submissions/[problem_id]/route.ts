import { Submission } from "@/lib/db/models/submission.model";
import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
const CURRENT_USER_ID = "666666666666666666666666";

export const GET = apiHandler(async (_, params: { problem_id: string }) => {
  const { problem_id } = params;

  const submissions = await Submission.find({ user: CURRENT_USER_ID, problem: problem_id }).sort({ createdAt: -1 });

  return { data: submissions, status: StatusCodes.OK };
});
