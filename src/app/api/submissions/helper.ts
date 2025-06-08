import { Submission } from "@/lib/db/models/submission.model";
import { ICreateSubmissionInput } from "@/types/submissions";

export const createSubmission = async (
  input: ICreateSubmissionInput,
  userId: string
) => {
  const submission = await Submission.create({
    user: userId,
    problem: input.problemId,
    code: input.code,
    language: input.language,
    resultStatus: input.resultStatus,
    executionTime: input.executionTime || 0,
    memoryUsed: input.memoryUsed || 0,
    logs: input.logs,
    testResults: input.testResults,
  });
  const newSubmission = await Submission.create(submission);
  return newSubmission;
};
