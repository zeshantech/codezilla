import { apiHandler } from "@/lib/errorHandler";
import { ICodeExecutionOutput } from "@/types";
import { StatusCodes } from "@/constants/statusCodes";

export const POST = apiHandler(async () => {
  const result: ICodeExecutionOutput = {
    status: "success",
    output: ["Hello, world!", "Happy coding!", "Goodbye, world!"],
    executionTime: 10,
    memoryUsed: 10,
  };

  return { data: result, status: StatusCodes.OK };
});
