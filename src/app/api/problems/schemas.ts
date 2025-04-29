import { stbConverter } from "@/lib/utils";
import { DifficultyEnum } from "@/types";
import { z } from "zod";

export const getProblemsQuerySchema = z.object({
  search: z.string().optional(),
  categories: z.array(z.string()).optional(),
  difficulties: z.array(z.nativeEnum(DifficultyEnum)).optional(),
  tags: z.array(z.string()).optional(),
  featured: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => stbConverter(val)),
  sortBy: z.enum(["popularity", "newest", "title", "difficulty", "completion_rate"]).optional(),
  myProblems: z.boolean().optional(),
});

export const createProblemSchema = z.object({
  title: z.string(),
  difficulty: z.nativeEnum(DifficultyEnum),
  category: z.string(),
  description: z.string(),
  constraints: z.array(z.string()),
  examples: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      explanation: z.string(),
    })
  ),
  testCases: z.array(
    z.object({
      input: z.string(),
      expectedOutput: z.string(),
      isHidden: z.boolean().optional(),
    })
  ),
  starterCode: z.record(z.string(), z.string()),
  solution: z.record(z.string(), z.string()).optional(),
  tags: z.array(z.string()),
});
