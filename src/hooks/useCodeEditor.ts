import { useState, useEffect, useCallback } from "react";
import { IRunTestsResult, IError, ISubmission } from "@/types";
import { toast } from "sonner";
import { useCodeExecution } from "./useCodeExecution";
import { CURRENT_USER } from "@/data/mock/users";
import { ProgrammingLanguageEnum } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/api";
import useProblems from "./useProblems";

interface UseCodeEditorProps {
  problemSlug: string;
  initialLanguage?: ProgrammingLanguageEnum;
  initialCode?: string;
}

export function useCodeEditor({ problemSlug, initialLanguage = ProgrammingLanguageEnum.JAVASCRIPT, initialCode }: UseCodeEditorProps) {
  const queryClient = useQueryClient();

  const [code, setCode] = useState<string>(initialCode || "");
  const [language, setLanguage] = useState<ProgrammingLanguageEnum>(initialLanguage);
  const [isDirty, setIsDirty] = useState(false);
  const [executionResult, setExecutionResult] = useState<IRunTestsResult | null>(null);

  const { executeCodeAsync, isExecutingCode } = useCodeExecution();
  const { data: problem, isLoading: isLoadingProblem } = useProblems().useProblem(problemSlug);

  // Initialially we check if the user has Progress for the problem
  useEffect(() => {
    if (!problem) return;
    const userProgress = problem.id ? CURRENT_USER.problemsProgress['two-sum'] : undefined;
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

  const useSaveSubmission = () => {
    return useMutation({
      mutationFn: async (executionResult: IRunTestsResult) => {
        const response = await api.post("/submissions", {
          problemId: problem?.id,
          code,
          language,
          executionResult,
        });

        return response.data;
      },
      onSuccess: (submission: ISubmission) => {
        queryClient.invalidateQueries({ queryKey: ["submissions", submission.problem] });
      },
      onError: (error: string) => {
        console.log(error);
        toast.error(error || "Error saving submission");
      },
    });
  };

  const useSaveCode = () => {
    return useMutation({
      mutationFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      },
      onSuccess: () => {
        setIsDirty(false);
        toast.success("Code saved successfully!");
      },
      onError: () => {
        toast.error("Failed to save code");
      },
    });
  };

  const useRunTestCases = () => {
    return useMutation({
      mutationFn: async (testCaseIdz?: number[]) => {
        setExecutionResult({ status: "running", output: ["Running test cases..."] });

        const response = await api.post<IRunTestsResult>("/run/test", {
          code,
          language,
          problemId: problem?.id,
          testCaseIdz,
        });

        return response.data;
      },
      onSuccess: (result) => {
        setExecutionResult(result);

        if (result.status === "error") {
          toast.error("Test execution failed. Check the error message.");
        } else if (result.allTestsPassed) {
          toast.success("All tests passed! 🎉");
        } else {
          const passedCount = result.testResults?.filter((t) => t.passed).length || 0;
          const totalCount = result.testResults?.length || 0;
          toast.info(`Passed ${passedCount}/${totalCount} tests.`);
        }

        saveSubmission.mutate(result);

        return result;
      },
      onError: (error: IError) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
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

  const submissions = useGetSubmissions(problem?.id || '');
  const saveSubmission = useSaveSubmission();
  const saveCode = useSaveCode();
  const runTestCases = useRunTestCases();

  const resetCode = useCallback(() => {
    if (problem) {
      const confirmReset = window.confirm("Are you sure you want to reset your code to the starter code?");

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

  const runCode = useCallback(async () => {
    if (!code.trim()) {
      toast.error("Cannot run empty code!");
      return;
    }

    const result = await executeCodeAsync({
      code,
      language,
    });

    setExecutionResult(result);

    // TODO: will save execution logs

    return result;
  }, [code, language, problem]);

  const changeLanguage = useCallback(
    (newLanguage: ProgrammingLanguageEnum) => {
      if (language !== newLanguage) {
        if (isDirty) {
          const confirmChange = window.confirm("Changing language will reset your current code. Continue?");
          if (!confirmChange) return;
        }

        setLanguage(newLanguage);

        if (problem) {
          const userProgress = problem.id ? CURRENT_USER.problemsProgress['two-sum'] : undefined;

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
