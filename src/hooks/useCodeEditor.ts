import { useState, useEffect, useCallback } from "react";
import { IRunTestsOutput, IRunTestCasesInput, IRunTestCasesOutput } from "@/types/testCases";
import { toast } from "sonner";
import { useCodeExecution } from "./useCodeExecution";
import { CURRENT_USER } from "@/data/mock/users";
import { ProgrammingLanguageEnum, ResultStatusEnum } from "@/types/enums";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/api";
import { useProblem } from "./useProblems";
import { ISubmission } from "@/types/submissions";

interface UseCodeEditorProps {
  problemSlug: string;
  initialLanguage?: ProgrammingLanguageEnum;
  initialCode?: string;
}

export function useCodeEditor({
  problemSlug,
  initialLanguage = ProgrammingLanguageEnum.JAVASCRIPT,
  initialCode,
}: UseCodeEditorProps) {
  const queryClient = useQueryClient();

  const [code, setCode] = useState<string>(initialCode || "");
  const [language, setLanguage] =
    useState<ProgrammingLanguageEnum>(initialLanguage);
  const [isDirty, setIsDirty] = useState(false);
  const [executionResult, setExecutionResult] =
    useState<IRunTestsOutput | null>(null);

  const { data: problem, isLoading: isLoadingProblem } =
    useProblem(problemSlug);

  // Initialially we check if the user has Progress for the problem
  useEffect(() => {
    if (!problem) return;
    const userProgress = problem.id
      ? CURRENT_USER.problemsProgress["two-sum"]
      : undefined;
    if (userProgress?.code?.[language]) {
      setCode(userProgress.code[language] || "");
    } else {
      setCode(problem.starterCode[language] || "");
    }

    setExecutionResult(null);
    setIsDirty(false);
  }, [problem, language]);

  const useGetSubmissions = (problemId: string) => {
    return useQuery({
      queryKey: ["submissions", problemId],
      queryFn: async () => {
        const response = await api.get(`/submissions/${problemId}`);
        return response.data;
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!problemId,
    });
  };

  const submissions = useGetSubmissions(problem?.id || "");
  const saveSubmission = useSaveSubmission();
  const saveCode = useSaveCode();
  const runTestCases = useRunTestCases();

  const resetCode = useCallback(() => {
    if (problem) {
      const confirmReset = window.confirm(
        "Are you sure you want to reset your code to the starter code?"
      );

      if (confirmReset) {
        setCode(problem.starterCode[language] || "");
        setIsDirty(false);
        setExecutionResult(null);
        toast.info("Code has been reset to starter code");
      }
    }
  }, [problem, language]);

  const formatCode = useCallback(() => {
    toast.success("Code formatted");
  }, []);

  //   const runCode = useCallback(async () => {
  //     if (!code.trim()) {
  //       toast.error("Cannot run empty code!");
  //       return;
  //     }

  //     const result = await executeCodeAsync({
  //       code,
  //       language,
  //     });

  //     setExecutionResult(result);

  //     // TODO: will save execution logs

  //     return result;
  //   }, [code, language, problem]);

  const changeLanguage = useCallback(
    (newLanguage: ProgrammingLanguageEnum) => {
      if (language !== newLanguage) {
        if (isDirty) {
          const confirmChange = window.confirm(
            "Changing language will reset your current code. Continue?"
          );
          if (!confirmChange) return;
        }

        setLanguage(newLanguage);

        if (problem) {
          const userProgress = problem.id
            ? CURRENT_USER.problemsProgress["two-sum"]
            : undefined;

          if (userProgress?.code && userProgress.code[newLanguage]) {
            setCode(userProgress.code[newLanguage] || "");
          } else {
            setCode(problem.starterCode[newLanguage] || "");
          }
        }

        setIsDirty(false);
        setExecutionResult(null);
      }
    },
    [language, isDirty, problem]
  );

  const updateCode = useCallback((newCode: string) => {
    setCode(newCode);
    setIsDirty(true);
  }, []);

  return {
    code,
    language,
    isDirty,
    executionResult,
    isExecutingCode,
    isLoadingProblem,
    problem: problem || null,
    problemSlug,
    submissions: submissions.data,
    isLoadingSubmissions: submissions.isLoading,
    isErrorSubmissions: submissions.isError,
    errorSubmissions: submissions.error,

    saveSubmission: saveSubmission.mutate,
    isSavingSubmission: saveSubmission.isPending,
    isSuccessSavingSubmission: saveSubmission.isSuccess,
    isErrorSavingSubmission: saveSubmission.isError,
    errorSavingSubmission: saveSubmission.error,

    saveCode: saveCode.mutate,
    isSavingCode: saveCode.isPending,
    isSuccessSavingCode: saveCode.isSuccess,
    isErrorSavingCode: saveCode.isError,
    errorSavingCode: saveCode.error,

    runTestCases: runTestCases.mutate,
    isRunningTestCases: runTestCases.isPending,
    isSuccessRunningTestCases: runTestCases.isSuccess,
    isErrorRunningTestCases: runTestCases.isError,
    errorRunningTestCases: runTestCases.error,

    updateCode,
    changeLanguage,
    runCode,
    resetCode,
    formatCode,
    clearExecutionResult: () => setExecutionResult(null),
  };
}

export function useCodeEditors(problemSlug: string) {
  const { data: problem, isLoading: isLoadingProblem } =
    useProblem(problemSlug);
  const { executeCode, isExecutingCode, codeExecutionResult } =
    useCodeExecution();

  const useRunTestCases = () => {
    return useMutation({
      mutationFn: async (input: IRunTestCasesInput) => {
        const response = await api.post<IRunTestsOutput>("/run/test", input);

        return response.data;
      },
      onSuccess: (result: IRunTestCasesOutput) => {
        if (result.status === ResultStatusEnum.FAILED) {
          toast.error("Test execution failed. Check the error message.");
        } else if (result.) {
          toast.success("All tests passed! 🎉");
        } else {
          const passedCount =
            result.testResults?.filter((t) => t.passed).length || 0;
          const totalCount = result.testResults?.length || 0;
          toast.info(`Passed ${passedCount}/${totalCount} tests.`);
        }

        saveSubmissionMutation.mutate(result);

        return result;
      },
      onError: (error: IError) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const failedResult = {
          status: "error" as const,
          output: ["Test execution failed"],
          error: errorMessage,
        };

        setExecutionResult(failedResult);
        toast.error("Test execution failed. Check the console for details.");

        return failedResult;
      },
    });
  };

  const formatedCode = useCallback((code: string) => {
    toast.success("Code formatted");
    return code;
  }, []);

  return {
    problem,
    isLoadingProblem,

    executeCode,
    isExecutingCode,
    codeExecutionResult,

    formatedCode,
  };
}

const useGetSubmissions = (problemId: string) => {
  return useQuery({
    queryKey: ["submissions", problemId],
    queryFn: async () => {
      const response = await api.get(`/submissions/${problemId}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!problemId,
  });
};

const useSaveCode = () => {
  return useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      toast.success("Code saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save code");
    },
  });
};
