import { useState, useEffect, useCallback } from "react";
import { IProblem, IEditorConfig, ICodeExecutionResult, ISubmission } from "@/types";
import { toast } from "sonner";
import useCodeExecution from "./useCodeExecution";
import { CURRENT_USER } from "@/data/mock/users";
import { ProgrammingLanguageEnum } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/api";

interface UseCodeEditorProps {
  problem?: IProblem | null;
  initialLanguage?: ProgrammingLanguageEnum;
  initialCode?: string;
}

export function useCodeEditor({ problem, initialLanguage = ProgrammingLanguageEnum.JAVASCRIPT, initialCode }: UseCodeEditorProps = {}) {
  const queryClient = useQueryClient();

  const [code, setCode] = useState<string>(initialCode || "");
  const [language, setLanguage] = useState<ProgrammingLanguageEnum>(initialLanguage);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [localExecutionResult, setLocalExecutionResult] = useState<ICodeExecutionResult | null>(null);
  const [localIsExecuting, setLocalIsExecuting] = useState(false);

  const { executeCode, executionResult, isExecuting, clearExecutionResult } = useCodeExecution();

  // Initialially we check if the user has Progress for the problem
  useEffect(() => {
    if (!problem) return;
    const userProgress = problem.id ? CURRENT_USER.problemsProgress[problem.id] : undefined;
    if (userProgress?.code?.[language]) {
      setCode(userProgress.code[language] || "");
    } else {
      setCode(problem.starterCode[language] || "");
    }

    clearExecutionResult();
    setLocalExecutionResult(null);
    setIsDirty(false);
  }, [problem, language, clearExecutionResult]);

  const changeLanguage = useCallback(
    (newLanguage: ProgrammingLanguageEnum) => {
      if (language !== newLanguage) {
        if (isDirty) {
          const confirmChange = window.confirm("Changing language will reset your current code. Continue?");
          if (!confirmChange) return;
        }

        setLanguage(newLanguage);

        // Update code for the new language
        if (problem) {
          const userProgress = problem.id ? CURRENT_USER.problemsProgress[problem.id] : undefined;

          if (userProgress?.code && userProgress.code[newLanguage]) {
            setCode(userProgress.code[newLanguage] || "");
          } else {
            setCode(problem.starterCode[newLanguage] || "");
          }
        }

        setIsDirty(false);
        clearExecutionResult();
        setLocalExecutionResult(null);
      }
    },
    [language, isDirty, problem, clearExecutionResult]
  );

  // Handle code change
  const updateCode = useCallback((newCode: string) => {
    setCode(newCode);
    setIsDirty(true);
  }, []);

  // Run code with test cases
  const runTestCases = useCallback(
    async (testCaseIds?: number[]) => {
      if (!code.trim() || !problem?.id) {
        toast.error("Code cannot be empty or problem not found!");
        return;
      }

      clearExecutionResult();
      setLocalExecutionResult({ status: "running", output: ["Running test cases..."] });
      setLocalIsExecuting(true);

      try {
        const response = await fetch("/api/run-tests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            language,
            problemId: problem.id,
            testCaseIds,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setLocalExecutionResult(result);

        // Show toast notification based on result
        if (result.status === "error") {
          toast.error("Test execution failed. Check the error message.");
        } else if (result.allTestsPassed) {
          toast.success("All tests passed! 🎉");
        } else {
          const passedCount = result.testResults.filter((t: any) => t.passed).length;
          const totalCount = result.testResults.length;
          toast.info(`Passed ${passedCount}/${totalCount} tests.`);
        }

        // Save the submission
        await saveSubmission(result);

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const failedResult = {
          status: "error" as const,
          output: ["Test execution failed"],
          error: errorMessage,
        };

        setLocalExecutionResult(failedResult);
        toast.error("Test execution failed. Check the console for details.");

        return failedResult;
      } finally {
        setLocalIsExecuting(false);
      }
    },
    [code, language, problem, clearExecutionResult]
  );

  const saveCode = useCallback(async () => {
    if (!problem) return;

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, this would update the user's saved code on the server
      setIsDirty(false);
      toast.success("Code saved successfully!");
    } catch (error) {
      toast.error("Failed to save code");
    } finally {
      setIsSaving(false);
    }
  }, [problem]);

  // Local variant of clearExecutionResult
  const localClearExecutionResult = useCallback(() => {
    clearExecutionResult();
    setLocalExecutionResult(null);
  }, [clearExecutionResult]);

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
      mutationFn: async (executionResult: ICodeExecutionResult) => {
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
      onError: (error) => {
        toast.error("Error saving submission");
      },
    });
  };

  const submissions = useGetSubmissions(problem?.id!);
  const saveSubmission = useSaveSubmission();

  const resetCode = useCallback(() => {
    if (problem) {
      const confirmReset = window.confirm("Are you sure you want to reset your code to the starter code?");

      if (confirmReset) {
        setCode(problem.starterCode[language] || "");
        setIsDirty(false);
        clearExecutionResult();
        setLocalExecutionResult(null);
        toast.info("Code has been reset to starter code");
      }
    }
  }, [problem, language, clearExecutionResult]);

  const formatCode = useCallback(() => {
    toast.success("Code formatted");
  }, []);

  const runCode = useCallback(async () => {
    if (!code.trim()) {
      toast.error("Cannot run empty code!");
      return;
    }

    const result = await executeCode({
      code,
      language,
      problemId: problem?.id,
    });

    setLocalExecutionResult(result);

    // Save the submission if we have a problem ID
    if (problem?.id) {
      saveSubmission.mutate(result);
    }

    return result;
  }, [code, language, problem, executeCode]);

  return {
    code,
    language,
    isSaving,
    isDirty,
    executionResult: localExecutionResult || executionResult,
    isExecuting: localIsExecuting || isExecuting,

    submissions: submissions.data,
    isLoadingSubmissions: submissions.isLoading,
    isErrorSubmissions: submissions.isError,
    errorSubmissions: submissions.error,

    updateCode,

    changeLanguage,
    runCode,
    runTestCases,
    resetCode,
    saveCode,
    formatCode,
    clearExecutionResult: localClearExecutionResult,
  };
}

export default useCodeEditor;
