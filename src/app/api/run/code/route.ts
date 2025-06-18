import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
import { ICodeExecutionOutput } from "@/types/testCases";
import { ResultStatusEnum } from "@/types/enums";

export const POST = apiHandler(async () => {
  const result: ICodeExecutionOutput = {
    status: ResultStatusEnum.SUCCESS,
    logs: ["Hello, world!", "Happy coding!", "Goodbye, world!"],
  };

  return { data: result, status: StatusCodes.OK };
});
