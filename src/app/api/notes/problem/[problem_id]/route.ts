import { StatusCodes } from "@/constants/statusCodes";
import { Note } from "@/lib/db/models/note.model";
import { apiHandler } from "@/lib/errorHandler";

const CURRENT_USER_ID = "666666666666666666666666";

export const GET = apiHandler(
  async (_, params: Promise<{ problem_id: string }>) => {
    const { problem_id } = await params;

    const notes = await Note.find({
      problem: problem_id,
      user: CURRENT_USER_ID,
    });

    return { data: notes, status: StatusCodes.OK };
  }
);

export const DELETE = apiHandler(
  async (_, params: Promise<{ problem_id: string }>) => {
    const { problem_id } = await params;

    const result = await Note.deleteMany({
      problem: problem_id,
      user: CURRENT_USER_ID,
    });

    return { data: result.deletedCount, status: StatusCodes.OK };
  }
);
