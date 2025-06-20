import { NextRequest } from "next/server";
import { createProblemSchema, getProblemsQuerySchema } from "./schemas";
import { createValidator } from "@/lib/validator";
import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
import { Problem } from "@/lib/db/models/problem.model";
import { generateSlug } from "./helpers";
import { auth0 } from "@/lib/auth0";
import { UnauthorizedException } from "@/lib/exceptions";
import { TestCase } from "@/lib/db/models/testCase.model";

const validateGetProblems = createValidator(getProblemsQuerySchema, "query");
const validateCreateProblem = createValidator(createProblemSchema, "body");

export const GET = apiHandler(async (request: NextRequest) => {
  const validatedParams = await validateGetProblems(request);
  const session = await auth0.getSession();
  const userId = session?.user?.id;

  let query = Problem.find();

  if (validatedParams.myProblems) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    query = query.where("createdBy").equals(userId);
  }

  if (validatedParams.search) {
    const searchTerm = validatedParams.search.toLowerCase();
    query = query.or([{ title: { $regex: searchTerm, $options: "i" } }, { description: { $regex: searchTerm, $options: "i" } }, { tags: { $in: [new RegExp(searchTerm, "i")] } }]);
  }

  if (validatedParams?.categories && validatedParams.categories.length > 0) {
    query = query.where("category").in(validatedParams.categories);
  }

  if (validatedParams?.featured !== undefined) {
    query = query.where("isFeatured").equals(validatedParams.featured);
  }

  if (validatedParams?.difficulties && validatedParams.difficulties.length > 0) {
    query = query.where("difficulty").in(validatedParams.difficulties);
  }

  if (validatedParams?.tags && validatedParams.tags.length > 0) {
    query = query.where("tags").in(validatedParams.tags);
  }

  if (validatedParams?.sortBy) {
    switch (validatedParams.sortBy) {
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
  return { data: problems, status: StatusCodes.OK };
});

export const POST = apiHandler(async (request: NextRequest) => {
  const validatedData = await validateCreateProblem(request);
  const session = await auth0.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new UnauthorizedException();
  }

  const newProblem = await Problem.create({
    ...validatedData,
    createdBy: userId,
    slug: await generateSlug(validatedData.title),
  });

  TestCase.insertMany(
    validatedData.testCases.map((testCase) => ({
      ...testCase,
      problem: newProblem._id,
    }))
  );

  return { data: newProblem, status: StatusCodes.CREATED };
});
