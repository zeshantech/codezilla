import { Submission } from "@/lib/db/models/submission.model";
import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
import { IPerformanceDistribution } from "@/types/submissions";
import { NextRequest } from "next/server";

const generateMockDistribution = (median: number, count: number): IPerformanceDistribution[] => {
  const distribution: IPerformanceDistribution[] = [];
  const min = median * 0.6;
  const max = median * 1.4;
  const step = (max - min) / count;

  for (let i = 0; i < count; i++) {
    const value = min + i * step;
    const countValue = Math.floor(Math.random() * 50) + 10;
    distribution.push({
      value: Math.round(value * 100) / 100,
      count: countValue,
      percentage: Math.round(Math.random() * 10) / 10,
    });
  }

  return distribution;
};

export const GET = apiHandler(async (_: NextRequest, params: Promise<{ problem_id: string; submission_id: string }>) => {
  const { submission_id } = await params;

  const submission = await Submission.findById(submission_id).populate("problem");

  if (!submission) {
    throw new Error("Submission not found");
  }

  // Mock distributions for demo
  const runtimeDistribution = generateMockDistribution(submission.executionTime || 37, 100);
  const memoryDistribution = generateMockDistribution(submission.memoryUsed || 56.54, 100);

  // Mock percentiles
  const runtimePercentile = 22.91;
  const memoryPercentile = 63.98;

  return {
    data: {
      ...submission.toJSON(),
      runtimeDistribution,
      memoryDistribution,
      runtimePercentile,
      memoryPercentile,
    },
    status: StatusCodes.OK,
  };
});
