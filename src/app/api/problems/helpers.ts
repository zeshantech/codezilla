import { Problem } from "@/lib/db/models/problem.model";
import { NotFoundException } from "@/lib/exceptions";

export const generateSlug = async (title: string) => {
  let slug = title.toLowerCase().replace(/ /g, "-");
  const existingProblem = await Problem.findOne({ slug: slug });
  if (existingProblem) {
    const dateNow = Date.now().toString();
    slug = slug + "-" + dateNow.slice(dateNow.length - 4);
  }

  return slug;
};

export const getProblemById = async (id: string) => {
  const problem = await Problem.findById(id);
  if (!problem) {
    throw new NotFoundException("Problem not found");
  }

  return problem;
};
