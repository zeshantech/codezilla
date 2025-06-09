import { SubmitCodeSchema } from "../schemas";
import { ISubmitCodeOutput } from "@/types/testCases";
import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
import { NextRequest } from "next/server";
import { createValidator } from "@/lib/validator";
import { getProblemById } from "../../problems/helpers";
import { createSubmission } from "../../submissions/helper";
import { ResultStatusEnum } from "@/types/enums";
import { TestCase } from "@/lib/db/models/testCase.model";

const validateSubmitCode = createValidator(SubmitCodeSchema, "body");

const CURRENT_USER_ID = "666666666666666666666666";

export const POST = apiHandler(async (req: NextRequest) => {
  const validatedParams = await validateSubmitCode(req);

  const problem = await getProblemById(validatedParams.problemId);
  const testCases = await TestCase.find({ problem: problem._id });

  await createSubmission(
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
      logs: ["Undefined is not a function (evaluating 'undefined.split')", "Undefined is not a function (evaluating 'undefined.split')", "Undefined is not a function (evaluating 'undefined.split')"],
      executionTime: 100,
      memoryUsed: 100,
    },
    CURRENT_USER_ID
  );

  return {
    data: {
      status: ResultStatusEnum.FAILED,
      executionTime: 100,
      memoryUsed: 100,
      error: "Undefined is not a function (evaluating 'undefined.split')",
      failedTestCase: testCases[1],
      passedCount: 0,
      totalCount: testCases.length,
      logs: ["Undefined is not a function (evaluating 'undefined.split')", "Undefined is not a function (evaluating 'undefined.split')", "Undefined is not a function (evaluating 'undefined.split')"],
    } satisfies ISubmitCodeOutput,
    status: StatusCodes.OK,
  };
});
