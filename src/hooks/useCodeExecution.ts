import { ICodeExecutionInput, ICodeExecutionOutput } from "@/types";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api/api";

export const useCodeExecution = () => {
  const codeExecution = useMutation<
    ICodeExecutionOutput,
    Error,
    ICodeExecutionInput
  >({
    mutationFn: async (request) => {
      const response = await api.post("/run/code", request);
      return response.data as ICodeExecutionOutput;
    },
  });

  return {
    executeCode: codeExecution.mutate,
    executeCodeAsync: codeExecution.mutateAsync,
    isExecutingCode: codeExecution.isPending,
    codeExecutionError: codeExecution.error,
    codeExecutionResult: codeExecution.data,
    isCodeExecutionSuccess: codeExecution.isSuccess,
    isCodeExecutionError: codeExecution.isError,
  };
};
