"use server";

import { Problem } from "../db/models/problem.model";
import {
  IProblem,
  IProblemFilters,
  IProblemSaveInput,
  ProgrammingLanguageEnum,
} from "@/types";
import api from "./api";

export async function fetchProblems(
  filters?: IProblemFilters
): Promise<IProblem[]> {
  const response = await api.get("/problems", { params: filters });
  return response.data;
}

export async function fetchProblemById(id: string): Promise<IProblem | null> {
  const response = await api.get(`/problems/${id}`);
  return response.data;
}

export async function fetchProblemBySlug(
  slug: string
): Promise<IProblem | null> {
  const response = await api.get(`/problems/slug/${slug}`);
  return response.data;
}

export async function fetchFeaturedProblems(): Promise<IProblem[]> {
  const response = await api.get("/problems", { params: { featured: true } });
  return response.data;
}

export async function fetchRandomProblem(): Promise<IProblem> {
  // await dbConnect();

  const count = await Problem.countDocuments();
  const random = Math.floor(Math.random() * count);
  const problem = await Problem.findOne().skip(random);

  if (!problem) {
    throw new Error("No problems found");
  }

  return problem;
}

export async function createProblem(
  input: IProblemSaveInput
): Promise<IProblem> {
  const response = await api.post("/problems", input);
  return response.data;
}

export async function updateProblemCode(
  userId: string,
  problemId: string,
  code: string,
  language: ProgrammingLanguageEnum
): Promise<boolean> {
  // await dbConnect();

  try {
    const { User } = await import("../db/models/user.model");

    const user = await User.findById(userId);
    if (!user) return false;

    let problemProgress = user.problemsProgress[problemId];

    if (!problemProgress) {
      problemProgress = {
        problem: problemId,

        status: "attempted",
        submissions: 0,
        lastSubmissionDate: new Date().toISOString(),
        code: {} as Record<ProgrammingLanguageEnum, string>,
      };
    }

    if (!problemProgress.code) {
      problemProgress.code = {} as Record<ProgrammingLanguageEnum, string>;
    }

    problemProgress.code[language] = code;

    // TODO: user.problemsProgress.set(problemId, problemProgress);

    await user.save();
    return true;
  } catch (error) {
    console.error("Error updating problem code:", error);
    return false;
  }
}
