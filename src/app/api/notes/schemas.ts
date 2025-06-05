import { z } from "zod";

export const getNotesQuerySchema = z.object({
  problemId: z.string(),
});

export const createNoteSchema = z.object({
  content: z.string(),
  problemId: z.string(),
});

export const updateNoteSchema = z.object({
  content: z.string(),
});
