import { DifficultyEnum } from "@/types";
import { z } from "zod";

export const getCollectionsQuerySchema = z.object({
  search: z.string().optional(),
  tags: z
    .string()
    .optional()
    .transform((val) => val?.split(",")),
  createdBy: z.string().optional(),
  featured: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => val === "true"),
  sortBy: z.enum(["popularity", "newest", "title", "difficulty"]).optional(),
});

export const createCollectionSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().default(""),
  problems: z.array(z.string()).optional(),
  slug: z.string().optional(),
  createdBy: z.string().optional(),
  isPublic: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  difficulty: z.nativeEnum(DifficultyEnum).optional(),
  tags: z.array(z.string()).default([]),
});

export const updateCollectionSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .optional(),
  description: z.string().optional(),
  problems: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  difficulty: z.nativeEnum(DifficultyEnum).optional(),
  tags: z.array(z.string()).optional(),
});
