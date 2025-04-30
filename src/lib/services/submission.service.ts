import dbConnect from "@/lib/db/connection";
import { Submission, ISubmission } from "@/lib/db/models/submission.model";
import { ICodeExecutionResult, ProgrammingLanguage } from "@/types";

/**
 * Create a new submission record
 */
export async function createSubmission({ userId, problemId, code, language, executionResult }: { userId: string; problemId: string; code: string; language: ProgrammingLanguage; executionResult: ICodeExecutionResult }): Promise<ISubmission> {
  await dbConnect();

  // Determine submission status based on test results
  let status: "attempted" | "solved" | "failed" = "attempted";

  if (executionResult.testResults && executionResult.testResults.length > 0) {
    status = executionResult.allTestsPassed ? "solved" : "failed";
  } else if (executionResult.status === "error") {
    status = "failed";
  }

  const submission = await Submission.create({
    userId,
    problemId,
    code,
    language,
    status,
    executionTime: executionResult.executionTime,
    memoryUsed: executionResult.memoryUsed,
    testResults: executionResult.testResults,
    logs: executionResult.output,
    error: executionResult.error,
  });

  return submission.toJSON();
}

/**
 * Get submissions for a user and problem
 */
export async function getUserProblemSubmissions(userId: string, problemId: string, limit = 10): Promise<ISubmission[]> {
  await dbConnect();

  const submissions = await Submission.find({ userId, problemId }).sort({ createdAt: -1 }).limit(limit);

  return submissions.map((submission) => submission.toJSON());
}

/**
 * Get the latest submission for a user and problem
 */
export async function getLatestUserSubmission(userId: string, problemId: string): Promise<ISubmission | null> {
  await dbConnect();

  const submission = await Submission.findOne({ userId, problemId }).sort({ createdAt: -1 });

  return submission ? submission.toJSON() : null;
}

/**
 * Get submissions statistics for a problem
 */
export async function getProblemSubmissionStats(problemId: string) {
  await dbConnect();

  const totalSubmissions = await Submission.countDocuments({ problemId });
  const solvedSubmissions = await Submission.countDocuments({
    problemId,
    status: "solved",
  });

  const uniqueUsers = await Submission.distinct("userId", { problemId });

  return {
    totalSubmissions,
    solvedSubmissions,
    uniqueAttempts: uniqueUsers.length,
    successRate: totalSubmissions > 0 ? (solvedSubmissions / totalSubmissions) * 100 : 0,
  };
}
