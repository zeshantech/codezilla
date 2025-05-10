import { ProgrammingLanguageEnum } from "@/types";
import { z } from "zod";

export const RunTestsSchema = z.object({
  code: z.string(),
  language: z.nativeEnum(ProgrammingLanguageEnum),
  problemId: z.string(),
  testCaseIdz: z.array(z.number()).optional(),
});

export const RunCodeSchema = z.object({
  code: z.string(),
  language: z.nativeEnum(ProgrammingLanguageEnum),
});
