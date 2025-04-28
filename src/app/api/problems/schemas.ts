import { DifficultyEnum } from "@/types";
import { z } from "zod";

export const getProblemsQuerySchema = z.object({
  search: z.string().optional(),
  categories: z.array(z.string()).optional(),
  difficulties: z.array(z.nativeEnum(DifficultyEnum)).optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z
    .enum(["popularity", "newest", "title", "difficulty", "completion_rate"])
    .optional(),
});

export const createProblemSchema = z.object({
  title: z.string(),
  slug: z.string(),
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
  popularity: z.number(),
  completionCount: z.number(),
  createdBy: z.string().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()),
});
