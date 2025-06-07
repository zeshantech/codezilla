import { NextRequest } from "next/server";
import { Problem } from "@/lib/db/models/problem.model";
import {
  IRunTestsOutput,
  ITestCase,
  ITestResult,
  ProgrammingLanguageEnum,
} from "@/types";
import { apiHandler } from "@/lib/errorHandler";
import { createValidator } from "@/lib/validator";
import { RunTestsSchema } from "../schemas";
import { NotFoundException } from "@/lib/exceptions";
import { StatusCodes } from "@/constants/statusCodes";

const validateRunTests = createValidator(RunTestsSchema, "body");

export const POST = apiHandler(async (req: NextRequest) => {
  const validatedParams = await validateRunTests(req);

  const problem = await Problem.findById(validatedParams.problemId);
  if (!problem) {
    throw new NotFoundException("Problem not found");
  }

  const testResults: ITestCase[] = validatedParams.testCaseIdz
    ? problem.testCases.filter((testCase) =>
        validatedParams.testCaseIdz?.includes(testCase.id.toString())
      )
    : problem.testCases;

  return {
    data: {
      allPassed: false,
      executionTime: 0,
      memoryUsed: 0,
      status: "success",
      output: [],
      error: null,
    },
    status: StatusCodes.OK,
  };
});
