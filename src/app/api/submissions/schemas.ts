import { ProgrammingLanguageEnum } from "@/types";
import { z } from "zod";

export const createSubmissionSchema = z.object({
  problemId: z.string(),
  code: z.string(),
  language: z.nativeEnum(ProgrammingLanguageEnum),
});
