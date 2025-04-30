import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/errorHandler";
import { createValidator } from "@/lib/validator";
import { createSubmissionSchema } from "./schemas";
import { Submission } from "@/lib/db/models/submission.model";
import { SubmissionStatusEnum } from "@/types";
import { StatusCodes } from "@/constants/statusCodes";

const CURRENT_USER_ID = "666666666666666666666666";

const validateCreateSubmission = createValidator(createSubmissionSchema, "body");

export const POST = apiHandler(async (request: NextRequest) => {
  const validatedParams = await validateCreateSubmission(request);

  let status: SubmissionStatusEnum = SubmissionStatusEnum.ATTEMPTED;

  const executionResult = {
    status: "success",
    output: ["Test case 1 passed", "Test case 2 passed"],
    testResults: [
      { passed: true, input: "1 2", expectedOutput: "3", actualOutput: "3", testCaseId: 1 },
      { passed: true, input: "2 3", expectedOutput: "5", actualOutput: "5", testCaseId: 2 },
    ],
    allTestsPassed: true,
    executionTime: 1000,
    memoryUsed: 1000,
    error: null,
  };

  if (executionResult.testResults?.length) {
    status = executionResult.allTestsPassed ? SubmissionStatusEnum.SOLVED : SubmissionStatusEnum.FAILED;
  } else if (executionResult.status === "error") {
    status = SubmissionStatusEnum.FAILED;
  }

  const submission = await Submission.create({
    user: CURRENT_USER_ID,
    problem: validatedParams.problemId,
    code: validatedParams.code,
    language: validatedParams.language,
    status,
    executionTime: executionResult.executionTime,
    memoryUsed: executionResult.memoryUsed,
    testResults: executionResult.testResults,
    logs: executionResult.output,
    error: executionResult.error,
  });

  return { data: submission, status: StatusCodes.CREATED };
});
