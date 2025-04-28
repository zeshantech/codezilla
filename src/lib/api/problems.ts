"use server";

import dbConnect from "../db/connection";
import { Problem } from "../db/models/problem.model";
import { IProblem, IProblemFilters, ProgrammingLanguage } from "@/types";

export async function fetchProblems(
  filters?: IProblemFilters
): Promise<IProblem[]> {
  try {
    await dbConnect();

    let query = Problem.find();

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      query = query.or([
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { tags: { $in: [new RegExp(searchTerm, "i")] } },
      ]);
    }

    if (filters?.categories && filters.categories.length > 0) {
      query = query.where("category").in(filters.categories);
    }

    if (filters?.difficulties && filters.difficulties.length > 0) {
      query = query.where("difficulty").in(filters.difficulties);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.where("tags").in(filters.tags);
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "popularity":
          query = query.sort({ popularity: -1 });
          break;
        case "newest":
          query = query.sort({ createdAt: -1 });
          break;
        case "title":
          query = query.sort({ title: 1 });
          break;
        case "difficulty":
          query = query.sort({ difficulty: 1 });
          break;
        case "completion_rate":
          query = query.sort({ completionCount: -1 });
          break;
        default:
          break;
      }
    }

    const problems = await query.exec();
    return problems;
  } catch (error) {
    console.error("Error fetching problems:", error);
    throw new Error("Failed to fetch problems");
  }
}

export async function fetchProblemById(id: string): Promise<IProblem | null> {
  await dbConnect();

  try {
    const problem = await Problem.findById(id);
    return problem;
  } catch (error) {
    console.error("Error fetching problem:", error);
    return null;
  }
}

export async function fetchFeaturedProblems(): Promise<IProblem[]> {
  await dbConnect();

  const problems = await Problem.find({ isFeatured: true });
  return problems;
}

export async function fetchRandomProblem(): Promise<IProblem> {
  await dbConnect();

  const count = await Problem.countDocuments();
  const random = Math.floor(Math.random() * count);
  const problem = await Problem.findOne().skip(random);

  if (!problem) {
    throw new Error("No problems found");
  }

  return problem;
}

export async function createProblem(
  problem: Omit<IProblem, "id" | "createdAt" | "updatedAt">
): Promise<IProblem> {
  try {
    await dbConnect();

    const newProblem = await Problem.create({
      ...problem,
      popularity: 0,
      completionCount: 0,
      isFeatured: false,
    });

    return newProblem;
  } catch (error) {
    console.error("Error creating problem:", error);
    throw new Error("Failed to create problem");
  }
}

export async function updateProblemCode(
  userId: string,
  problemId: string,
  code: string,
  language: ProgrammingLanguage
): Promise<boolean> {
  await dbConnect();

  try {
    const { User } = await import("../db/models/user.model");

    const user = await User.findById(userId);
    if (!user) return false;

    let problemProgress = user.problemsProgress.get(problemId);

    if (!problemProgress) {
      problemProgress = {
        problemId,
        status: "attempted",
        submissions: 0,
        lastSubmissionDate: new Date().toISOString(),
        code: new Map<ProgrammingLanguage, string>(),
      };
    }

    if (!problemProgress.code) {
      problemProgress.code = new Map<ProgrammingLanguage, string>();
    }

    problemProgress.code.set(language, code);

    user.problemsProgress.set(problemId, problemProgress);

    await user.save();
    return true;
  } catch (error) {
    console.error("Error updating problem code:", error);
    return false;
  }
}
