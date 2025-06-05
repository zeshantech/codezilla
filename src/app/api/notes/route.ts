import { NextRequest } from "next/server";
import { Note } from "@/lib/db/models/note.model";
import { createValidator } from "@/lib/validator";
import { createNoteSchema } from "./schemas";
import { StatusCodes } from "@/constants/statusCodes";
import { apiHandler } from "@/lib/errorHandler";

const CURRENT_USER_ID = "666666666666666666666666";

const validateCreateNote = createValidator(createNoteSchema, "body");

export const POST = apiHandler(async (request: NextRequest) => {
  const validatedParams = await validateCreateNote(request);

  const note = new Note({
    user: CURRENT_USER_ID,
    problem: validatedParams.problemId,
    content: validatedParams.content,
  });

  await note.save();

  return { data: note, status: StatusCodes.CREATED };
});
