import { ICodeExecutionRequest, ICodeExecutionResult } from "@/types";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api/api";

export const useCodeExecution = () => {
  const codeExecution = useMutation<ICodeExecutionResult, Error, ICodeExecutionRequest>({
    mutationFn: async (request) => {
      const response = await api.post("/run/code", request);
      return response.data;
    },
  });

  return {
    executeCode: codeExecution.mutate,
    executeCodeAsync: codeExecution.mutateAsync,
    isExecutingCode: codeExecution.isPending,
    codeExecutionError: codeExecution.error,
    codeExecutionData: codeExecution.data,
    isCodeExecutionSuccess: codeExecution.isSuccess,
    isCodeExecutionError: codeExecution.isError,
  };
};
