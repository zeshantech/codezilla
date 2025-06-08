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
    } satisfies IRunTestCasesOutput,
    status: StatusCodes.OK,
  };
});
