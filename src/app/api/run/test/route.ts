import { NextRequest } from "next/server";
import { Problem } from "@/lib/db/models/problem.model";
import { IRunTestCasesOutput } from "@/types/testCases";
import { apiHandler } from "@/lib/errorHandler";
import { createValidator } from "@/lib/validator";
import { RunTestsSchema } from "../schemas";
import { StatusCodes } from "@/constants/statusCodes";
import { ITestCase } from "@/types/testCases";
import { getProblemById } from "../../problems/helpers";
import { TestCase } from "@/lib/db/models/testCase.model";
import { ResultStatusEnum } from "@/types/enums";
import { createSubmission } from "../../submissions/helper";

const validateRunTests = createValidator(RunTestsSchema, "body");

const CURRENT_USER_ID = "666666666666666666666666";

export const POST = apiHandler(async (req: NextRequest) => {
  const validatedParams = await validateRunTests(req);

  const problem = await getProblemById(validatedParams.problemId);

  const testCases: ITestCase[] = validatedParams.testCaseIdz
    ? await TestCase.find({
        _id: { $in: validatedParams.testCaseIdz },
        problem: problem._id,
      })
    : await TestCase.find({ problem: problem._id });

  if (!validatedParams.testCaseIdz?.length) {
    createSubmission(
      {
        problemId: validatedParams.problemId,
        code: validatedParams.code,
        language: validatedParams.language,
        resultStatus: ResultStatusEnum.FAILED,
        testResults: testCases.map((testCase) => ({
          passed: false,
          output: "",
          error: "Undefined is not a function (evaluating 'undefined.split')",
          testCase: testCase.id,
        })),
        logs: [
          "Undefined is not a function (evaluating 'undefined.split')",
          "Undefined is not a function (evaluating 'undefined.split')",
          "Undefined is not a function (evaluating 'undefined.split')",
        ],
        executionTime: 100,
        memoryUsed: 100,
      },
      CURRENT_USER_ID
    );
  }

  return {
    data: {
      status: ResultStatusEnum.FAILED,
      executionTime: 100,
      memoryUsed: 100,
      error: "Undefined is not a function (evaluating 'undefined.split')",
      failedTestCase: testCases[1],
    } satisfies IRunTestCasesOutput,
    status: StatusCodes.OK,
  };
});
