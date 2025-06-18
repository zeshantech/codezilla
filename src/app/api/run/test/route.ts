import { NextRequest } from "next/server";
import { IRunTestCasesOutput } from "@/types/testCases";
import { apiHandler } from "@/lib/errorHandler";
import { createValidator } from "@/lib/validator";
import { RunTestsSchema } from "../schemas";
import { StatusCodes } from "@/constants/statusCodes";
import { getProblemById } from "../../problems/helpers";
import { TestCase } from "@/lib/db/models/testCase.model";
import { ResultStatusEnum } from "@/types/enums";

const validateRunTests = createValidator(RunTestsSchema, "body");

export const POST = apiHandler(async (req: NextRequest) => {
  const validatedParams = await validateRunTests(req);

  const problem = await getProblemById(validatedParams.problemId);

  const testCases = await TestCase.find({
    problem: problem._id,
    _id: { $in: validatedParams.testCaseIdz },
  });

  return {
    data: {
      status: ResultStatusEnum.FAILED,
      error: "Undefined is not a function (evaluating 'undefined.split')",
      failedTestCase: testCases[1],
      passedCount: 0,
      totalCount: testCases.length,
      logs: ["Running test cases...", "Test case 1: Input: 1 2, Expected Output: 3, Actual Output: 3", "Test case 2: Input: 2 3, Expected Output: 5, Actual Output: 5", "Test case 3: Input: 3 4, Expected Output: 7, Actual Output: 7", "Test case 4: Input: 4 5, Expected Output: 9, Actual Output: 9", "Test case 5: Input: 5 6, Expected Output: 11, Actual Output: 11"],
      testResults: [],
    } satisfies IRunTestCasesOutput,
    status: StatusCodes.OK,
  };
});
