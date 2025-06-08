import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { IError } from "@/types";
import { ICodeExecutionInput, ICodeExecutionOutput } from "@/types/testCases";
import api from "@/lib/api/api";
import { ResultStatusEnum } from "@/types/enums";

export const useCodeExecution = () => {
  return useMutation({
    mutationFn: async (input: ICodeExecutionInput) => {
      const response = await api.post<ICodeExecutionOutput>(
        "/run/execute",
        input
      );
      return response.data;
    },
    onSuccess: (result: ICodeExecutionOutput) => {
      if (result.status === ResultStatusEnum.PASSED) {
        toast.success("Code executed successfully!");
      } else {
        toast.error("Code execution failed. Check the console for details.");
      }
    },
    onError: (error: IError) => {
      toast.error(error.message || "Code execution failed.");
      return error;
    },
  });
};
