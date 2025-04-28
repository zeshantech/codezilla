import { NextRequest, NextResponse } from "next/server";
import { fetchProblems, createProblem } from "@/lib/api/problems";
import dbConnect from "@/lib/db/connection";
import { createProblemSchema, getProblemsQuerySchema } from "./schemas";
import { createValidator } from "@/lib/validator";
import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
import { Problem } from "@/lib/db/models/problem.model";

const validateGetProblems = createValidator(getProblemsQuerySchema, "query");
const validateCreateProblem = createValidator(createProblemSchema, "body");

export const GET = apiHandler(async (request: NextRequest) => {
  const validatedParams = await validateGetProblems(request);

  const problems = await fetchProblems(validatedParams);
  return { data: problems, status: StatusCodes.OK };
});

// POST /api/problems - Create a new problem
export const POST = apiHandler(async (request: NextRequest) => {
  try {
    const validatedData = await validateCreateProblem(request);
    await dbConnect();
    const newProblem = await createProblem(validatedData);
    return { data: newProblem, status: StatusCodes.CREATED };
  } catch (error) {
    console.error("Error creating problem:", error);
    return {
      data: { error: "Failed to create problem" },
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
});
