import { create } from "zustand";
import { IProblem } from "@/types/problems";
import { ICodeExecutionOutput, IRunTestCasesOutput, ISubmitCodeOutput } from "@/types/testCases";
import { useRunTestCases, useSubmitCode, useSaveCode } from "@/hooks/useCodeEditor";
import { useCodeExecution } from "@/hooks/useCodeExecution";
import { toast } from "sonner";
import { ProgrammingLanguageEnum } from "@/types/enums";
import { useCallback, useEffect } from "react";
import { useProblem } from "@/hooks/useProblems";

interface ICodeEditor {
  problem: IProblem | null;
  isLoadingProblem: boolean;
  isErrorLoadingProblem: boolean;

  code: string;
  language: ProgrammingLanguageEnum;
  isDirty: boolean;

  // actions
  updateCode: (newCode: string) => void;
  changeLanguage: (newLanguage: ProgrammingLanguageEnum) => void;
  formatCode: () => void;
  resetCode: () => void;

  saveCodeResult: ICodeExecutionOutput | null; // TODO: will change
  saveCode: () => void;
  isSavingCode: boolean;
  isSuccessSavingCode: boolean;
  isErrorSavingCode: boolean;
  errorSavingCode: string | null;

  executeCodeResult: ICodeExecutionOutput | null;
  executeCode: () => void;
  isExecutingCode: boolean;
  isSuccessExecutingCode: boolean;
  isErrorExecutingCode: boolean;
  errorExecutingCode: string | null;
  clearExecutionResult: () => void;

  runTestCasesResult: IRunTestCasesOutput | null;
  runTestCases: (idz: string[]) => void;
  isRunningTestCases: boolean;
  isSuccessRunningTestCases: boolean;
  isErrorRunningTestCases: boolean;
  errorRunningTestCases: string | null;

  submitCodeResult: ISubmitCodeOutput | null;
  submitCode: () => void;
  isSubmittingCode: boolean;
  isSuccessSubmittingCode: boolean;
  isErrorSubmittingCode: boolean;
  errorSubmittingCode: string | null;
}

// Create the store without implementing the functions yet
export const useCodeEditorStore = create<ICodeEditor>((set, get) => ({
  problem: null,
  isLoadingProblem: false,
  isErrorLoadingProblem: false,
  code: "",
  language: ProgrammingLanguageEnum.JAVASCRIPT,
  isDirty: false,

  saveCodeResult: null,
  isSavingCode: false,
  isSuccessSavingCode: false,
  isErrorSavingCode: false,
  errorSavingCode: null,

  executeCodeResult: null,
  isExecutingCode: false,
  isSuccessExecutingCode: false,
  isErrorExecutingCode: false,
  errorExecutingCode: null,

  runTestCasesResult: null,
  isRunningTestCases: false,
  isSuccessRunningTestCases: false,
  isErrorRunningTestCases: false,
  errorRunningTestCases: null,

  submitCodeResult: null,
  isSubmittingCode: false,
  isSuccessSubmittingCode: false,
  isErrorSubmittingCode: false,
  errorSubmittingCode: null,

  updateCode: (newCode) => {
    set({ code: newCode, isDirty: true });
  },

  changeLanguage: (newLanguage) => {
    const { problem, isDirty } = get();

    if (isDirty) {
      const confirmChange = window.confirm("Changing language will reset your current code. Continue?");
      if (!confirmChange) return;
    }

    set({ language: newLanguage, isDirty: false });

    // Set starter code for the new language if available
    if (problem?.starterCode?.[newLanguage]) {
      set({ code: problem.starterCode[newLanguage] });
    }
  },

  formatCode: () => {
    const { code } = get();
    toast.success("Code formatted");
    // In a real implementation, you'd actually format the code here
    return;
  },

  resetCode: () => {
    const { problem, language } = get();

    if (problem) {
      const confirmReset = window.confirm("Are you sure you want to reset your code to the starter code?");

      if (confirmReset) {
        set({
          code: problem.starterCode[language] || "",
          isDirty: false,
          executeCodeResult: null,
        });
        toast.info("Code has been reset to starter code");
      }
    }
  },

  clearExecutionResult: () => {
    set({ executeCodeResult: null });
  },

  saveCode: () => {
    // Implementation will be handled by the useInitializeCodeEditor hook
  },
  executeCode: () => {
    // Implementation will be handled by the useInitializeCodeEditor hook
  },
  runTestCases: () => {
    // TODO: implement this
    // Implementation will be handled by the useInitializeCodeEditor hook
  },
  submitCode: () => {
    // Implementation will be handled by the useInitializeCodeEditor hook
  },
}));

// Hook to initialize the store with the problem data and mutation functions
export function useInitializeCodeEditor(problemSlug: string) {
  const { data: problem, isLoading: isLoadingProblem, isError: isErrorLoadingProblem } = useProblem(problemSlug);

  const codeExecutionMutation = useCodeExecution();
  const runTestCasesMutation = useRunTestCases();
  const submitCodeMutation = useSubmitCode();
  const saveCodeMutation = useSaveCode();
  const store = useCodeEditorStore();

  // Update store with problem data
  useEffect(() => {
    if (problem !== undefined) {
      useCodeEditorStore.setState({ problem });

      // Set initial code based on the problem's starter code for the current language
      if (problem.starterCode?.[store.language]) {
        // First update the code
        store.updateCode(problem.starterCode[store.language]);
        // Then reset isDirty in a separate update
        useCodeEditorStore.setState({ isDirty: false });
      }
    }

    useCodeEditorStore.setState({ isLoadingProblem, isErrorLoadingProblem });
  }, [problem, isLoadingProblem, isErrorLoadingProblem, store.language]);

  // Override the action implementations
  useEffect(() => {
    store.saveCode = () => {
      saveCodeMutation.mutate();
    };

    store.executeCode = () => {
      if (!store.code.trim()) {
        toast.error("Cannot run empty code!");
        return;
      }

      codeExecutionMutation.mutate({
        code: store.code,
        language: store.language,
      });
    };

    store.runTestCases = (idz: string[]) => {
      runTestCasesMutation.mutate({
        testCaseIdz: idz,
        code: store.code,
        language: store.language,
        problemId: store.problem?.id ?? "",
      });
    };

    store.submitCode = () => {
      submitCodeMutation.mutate({
        code: store.code,
        language: store.language,
        problemId: store.problem?.id ?? "",
      });
    };
  }, [saveCodeMutation, codeExecutionMutation, runTestCasesMutation, submitCodeMutation, store]);

  // Update store with mutation states
  useEffect(() => {
    useCodeEditorStore.setState({
      saveCodeResult: saveCodeMutation.data || null,
      isSavingCode: saveCodeMutation.isPending,
      isSuccessSavingCode: saveCodeMutation.isSuccess,
      isErrorSavingCode: saveCodeMutation.isError,
      errorSavingCode: saveCodeMutation.error?.message || null,
    });
  }, [saveCodeMutation.data, saveCodeMutation.isPending, saveCodeMutation.isSuccess, saveCodeMutation.isError, saveCodeMutation.error]);

  useEffect(() => {
    useCodeEditorStore.setState({
      executeCodeResult: codeExecutionMutation.data,
      isExecutingCode: codeExecutionMutation.isPending,
      isSuccessExecutingCode: codeExecutionMutation.isSuccess,
      isErrorExecutingCode: codeExecutionMutation.isError,
      errorExecutingCode: codeExecutionMutation.error?.message || null,
    });
  }, [codeExecutionMutation.data, codeExecutionMutation.isPending, codeExecutionMutation.isSuccess, codeExecutionMutation.isError, codeExecutionMutation.error]);

  useEffect(() => {
    useCodeEditorStore.setState({
      runTestCasesResult: runTestCasesMutation.data,
      isRunningTestCases: runTestCasesMutation.isPending,
      isSuccessRunningTestCases: runTestCasesMutation.isSuccess,
      isErrorRunningTestCases: runTestCasesMutation.isError,
      errorRunningTestCases: runTestCasesMutation.error?.message || null,
    });
  }, [runTestCasesMutation.data, runTestCasesMutation.isPending, runTestCasesMutation.isSuccess, runTestCasesMutation.isError, runTestCasesMutation.error]);

  useEffect(() => {
    useCodeEditorStore.setState({
      submitCodeResult: submitCodeMutation.data,
      isSubmittingCode: submitCodeMutation.isPending,
      isSuccessSubmittingCode: submitCodeMutation.isSuccess,
      isErrorSubmittingCode: submitCodeMutation.isError,
      errorSubmittingCode: submitCodeMutation.error?.message || null,
    });
  }, [submitCodeMutation.data, submitCodeMutation.isPending, submitCodeMutation.isSuccess, submitCodeMutation.isError, submitCodeMutation.error]);
}
