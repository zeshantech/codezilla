import { DifficultyEnum } from "@/types";
import { stbConverter } from "@/lib/utils";
import { z } from "zod";

export const getCollectionsQuerySchema = z.object({
  search: z.string().optional(),
  tags: z
    .string()
    .optional()
    .transform((val) => val?.split(",")),
  featured: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => stbConverter(val)),
  sortBy: z.enum(["popularity", "newest", "title", "difficulty", "completion_rate"]).optional(),
  myCollections: z.boolean().optional(),
});

export const createCollectionSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().default(""),
  problems: z.array(z.string()).default([]),
  isPublic: z.boolean().default(false),
  difficulty: z.nativeEnum(DifficultyEnum).optional(),
  tags: z.array(z.string()).default([]),
});

export const updateCollectionSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).optional(),
  description: z.string().optional(),
  problems: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
  difficulty: z.nativeEnum(DifficultyEnum).optional(),
  tags: z.array(z.string()).optional(),
});
