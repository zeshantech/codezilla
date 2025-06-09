import { useState, useEffect, useCallback } from "react";
import { IRunTestCasesInput, IRunTestCasesOutput, ISubmitCodeOutput, ISubmitCodeInput } from "@/types/testCases";
import { toast } from "sonner";
import { useCodeExecution } from "./useCodeExecution";
import { CURRENT_USER } from "@/data/mock/users";
import { ProgrammingLanguageEnum, ResultStatusEnum } from "@/types/enums";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/api";
import { useProblem } from "./useProblems";
import { ISubmission, ISubmissionDetails } from "@/types/submissions";
import { IError } from "@/types";

// export function useCodeEditor({
//   problemSlug,
//   initialLanguage = ProgrammingLanguageEnum.JAVASCRIPT,
//   initialCode,
// }: UseCodeEditorProps) {
//   const queryClient = useQueryClient();

//   const [code, setCode] = useState<string>(initialCode || "");
//   const [language, setLanguage] =
//     useState<ProgrammingLanguageEnum>(initialLanguage);
//   const [isDirty, setIsDirty] = useState(false);
//   const [executionResult, setExecutionResult] =
//     useState<IRunTestsOutput | null>(null);

//   const { data: problem, isLoading: isLoadingProblem } =
//     useProblem(problemSlug);

//   // Initialially we check if the user has Progress for the problem
//   useEffect(() => {
//     if (!problem) return;
//     const userProgress = problem.id
//       ? CURRENT_USER.problemsProgress["two-sum"]
//       : undefined;
//     if (userProgress?.code?.[language]) {
//       setCode(userProgress.code[language] || "");
//     } else {
//       setCode(problem.starterCode[language] || "");
//     }

//     setExecutionResult(null);
//     setIsDirty(false);
//   }, [problem, language]);

//   const useGetSubmissions = (problemId: string) => {
//     return useQuery({
//       queryKey: ["submissions", problemId],
//       queryFn: async () => {
//         const response = await api.get(`/submissions/${problemId}`);
//         return response.data;
//       },
//       staleTime: 1000 * 60 * 5,
//       enabled: !!problemId,
//     });
//   };

//   const submissions = useGetSubmissions(problem?.id || "");
//   const saveSubmission = useSaveSubmission();
//   const saveCode = useSaveCode();
//   const runTestCases = useRunTestCases();

//   const resetCode = useCallback(() => {
//     if (problem) {
//       const confirmReset = window.confirm(
//         "Are you sure you want to reset your code to the starter code?"
//       );

//       if (confirmReset) {
//         setCode(problem.starterCode[language] || "");
//         setIsDirty(false);
//         setExecutionResult(null);
//         toast.info("Code has been reset to starter code");
//       }
//     }
//   }, [problem, language]);

//   const formatCode = useCallback(() => {
//     toast.success("Code formatted");
//   }, []);

//   //   const runCode = useCallback(async () => {
//   //     if (!code.trim()) {
//   //       toast.error("Cannot run empty code!");
//   //       return;
//   //     }

//   //     const result = await executeCodeAsync({
//   //       code,
//   //       language,
//   //     });

//   //     setExecutionResult(result);

//   //     // TODO: will save execution logs

//   //     return result;
//   //   }, [code, language, problem]);

//   const changeLanguage = useCallback(
//     (newLanguage: ProgrammingLanguageEnum) => {
//       if (language !== newLanguage) {
//         if (isDirty) {
//           const confirmChange = window.confirm(
//             "Changing language will reset your current code. Continue?"
//           );
//           if (!confirmChange) return;
//         }

//         setLanguage(newLanguage);

//         if (problem) {
//           const userProgress = problem.id
//             ? CURRENT_USER.problemsProgress["two-sum"]
//             : undefined;

//           if (userProgress?.code && userProgress.code[newLanguage]) {
//             setCode(userProgress.code[newLanguage] || "");
//           } else {
//             setCode(problem.starterCode[newLanguage] || "");
//           }
//         }

//         setIsDirty(false);
//         setExecutionResult(null);
//       }
//     },
//     [language, isDirty, problem]
//   );

//   const updateCode = useCallback((newCode: string) => {
//     setCode(newCode);
//     setIsDirty(true);
//   }, []);

//   return {
//     code,
//     language,
//     isDirty,
//     executionResult,
//     isExecutingCode,
//     isLoadingProblem,
//     problem: problem || null,
//     problemSlug,
//     submissions: submissions.data,
//     isLoadingSubmissions: submissions.isLoading,
//     isErrorSubmissions: submissions.isError,
//     errorSubmissions: submissions.error,

//     saveSubmission: saveSubmission.mutate,
//     isSavingSubmission: saveSubmission.isPending,
//     isSuccessSavingSubmission: saveSubmission.isSuccess,
//     isErrorSavingSubmission: saveSubmission.isError,
//     errorSavingSubmission: saveSubmission.error,

//     saveCode: saveCode.mutate,
//     isSavingCode: saveCode.isPending,
//     isSuccessSavingCode: saveCode.isSuccess,
//     isErrorSavingCode: saveCode.isError,
//     errorSavingCode: saveCode.error,

//     runTestCases: runTestCases.mutate,
//     isRunningTestCases: runTestCases.isPending,
//     isSuccessRunningTestCases: runTestCases.isSuccess,
//     isErrorRunningTestCases: runTestCases.isError,
//     errorRunningTestCases: runTestCases.error,

//     updateCode,
//     changeLanguage,
//     runCode,
//     resetCode,
//     formatCode,
//     clearExecutionResult: () => setExecutionResult(null),
//   };
// }

export function useCodeEditor(problemSlug: string) {
  const { data: problem, isLoading: isLoadingProblem } = useProblem(problemSlug);

  const formatedCode = useCallback((code: string) => {
    toast.success("Code formatted");
    return code;
  }, []);

  const codeExecutionMutation = useCodeExecution();
  const runTestCasesMutation = useRunTestCases();
  const submitCodeMutation = useSubmitCode();
  const saveCodeMutation = useSaveCode();

  return {
    problem: problem || null,
    isLoadingProblem,
    formatedCode,

    saveCode: saveCodeMutation.mutate,
    saveCodeResult: saveCodeMutation.data,
    isSavingCode: saveCodeMutation.isPending,
    isSuccessSavingCode: saveCodeMutation.isSuccess,
    isErrorSavingCode: saveCodeMutation.isError,
    errorSavingCode: saveCodeMutation.error,

    executeCode: codeExecutionMutation.mutate,
    executeCodeResult: codeExecutionMutation.data,
    isExecutingCode: codeExecutionMutation.isPending,
    isSuccessExecutingCode: codeExecutionMutation.isSuccess,
    isErrorExecutingCode: codeExecutionMutation.isError,
    errorExecutingCode: codeExecutionMutation.error,

    runTestCases: runTestCasesMutation.mutate,
    runTestCasesResult: runTestCasesMutation.data,
    isRunningTestCases: runTestCasesMutation.isPending,
    isSuccessRunningTestCases: runTestCasesMutation.isSuccess,
    isErrorRunningTestCases: runTestCasesMutation.isError,
    errorRunningTestCases: runTestCasesMutation.error,

    submitCode: submitCodeMutation.mutate,
    submitCodeResult: submitCodeMutation.data,
    isSubmittingCode: submitCodeMutation.isPending,
    isSuccessSubmittingCode: submitCodeMutation.isSuccess,
    isErrorSubmittingCode: submitCodeMutation.isError,
    errorSubmittingCode: submitCodeMutation.error,
  };
}

export const useSubmissions = (problemId: string) => {
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

export const useSubmission = (problemId: string, submissionId: string) => {
  return useQuery({
    queryKey: ["submission", submissionId],
    queryFn: async () => {
      const response = await api.get<ISubmissionDetails>(`/submissions/${problemId}/${submissionId}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!problemId && !!submissionId,
  });
};

export const useSaveCode = () => {
  return useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      toast.success("Code saved successfully!");
    },
    onError: (error: IError) => {
      toast.error(error.message || "Failed to save code");

      return error.message;
    },
  });
};

export const useRunTestCases = () => {
  return useMutation({
    mutationFn: async (input: IRunTestCasesInput) => {
      const response = await api.post<IRunTestCasesOutput>("/run/test", input);

      return response.data;
    },
    onSuccess: (result: IRunTestCasesOutput) => {
      if (result.status === ResultStatusEnum.SUCCESS) {
        toast.success("All tests passed! 🎉");
      } else {
        toast.info(`Passed ${result.passedCount}/${result.totalCount} tests.`);
        toast.error("Test execution failed. Check the error message.");
      }
    },
    onError: (error: IError) => {
      toast.error(error.message || "Test execution failed.");

      return error.message;
    },
  });
};

export const useSubmitCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ISubmitCodeInput) => {
      const response = await api.post<ISubmitCodeOutput>("/run/submit", input);
      queryClient.invalidateQueries({ queryKey: ["submissions"] });

      return response.data;
    },
    onSuccess: (result: ISubmitCodeOutput) => {
      if (result.status === ResultStatusEnum.SUCCESS) {
        toast.success("All tests passed! 🎉");
      } else {
        toast.info(`Passed ${result.passedCount}/${result.totalCount} tests.`);
        toast.error("Test execution failed. Check the error message.");
      }
    },
    onError: (error: IError) => {
      toast.error(error.message || "Test execution failed.");

      return error.message;
    },
  });
};
