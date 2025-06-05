import { NextRequest } from "next/server";
import { Note } from "@/lib/db/models/note.model";
import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
import { createValidator } from "@/lib/validator";
import { updateNoteSchema } from "../schemas";
import { NotFoundException } from "@/lib/exceptions";

const CURRENT_USER_ID = "666666666666666666666666";

const validateUpdateNote = createValidator(updateNoteSchema, "body");

export const PUT = apiHandler(
  async (request: NextRequest, params: Promise<{ note_id: string }>) => {
    const { note_id } = await params;
    const validatedParams = await validateUpdateNote(request);

    const note = await Note.findOneAndUpdate(
      {
        _id: note_id,
        user: CURRENT_USER_ID,
      },
      { content: validatedParams.content },
      { new: true }
    );

    if (!note) {
      throw new NotFoundException("Note not found");
    }

    return { data: note, status: StatusCodes.OK };
  }
);

export const DELETE = apiHandler(
  async (_, params: Promise<{ note_id: string }>) => {
    const { note_id } = await params;

    const result = await Note.findOneAndDelete({
      _id: note_id,
      user: CURRENT_USER_ID,
    });

    if (!result) {
      throw new NotFoundException("Note not found");
    }

    return { data: result, status: StatusCodes.OK };
  }
);
