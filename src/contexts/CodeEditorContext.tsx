import { createContext, useContext } from "react";
import { useCodeEditor } from "@/hooks/useCodeEditor";
import { IProblem, IRunTestsResult, ProgrammingLanguageEnum } from "@/types";
import { ReactNode } from "react";

interface CodeEditorContextProps {
  code: string;
  language: ProgrammingLanguageEnum;
  isDirty: boolean;
  problem: IProblem | null;
  isLoadingProblem: boolean;
  problemSlug: string;
  executionResult: IRunTestsResult | null;
  isExecutingCode: boolean;
  submissions: any;
  isLoadingSubmissions: boolean;
  isErrorSubmissions: boolean;
  errorSubmissions: unknown;

  saveSubmission: (executionResult: IRunTestsResult) => void;
  isSavingSubmission: boolean;
  isSuccessSavingSubmission: boolean;
  isErrorSavingSubmission: boolean;
  errorSavingSubmission: unknown;

  saveCode: () => void;
  isSavingCode: boolean;
  isSuccessSavingCode: boolean;
  isErrorSavingCode: boolean;
  errorSavingCode: unknown;

  runTestCases: (testCaseIdz?: number[]) => void;
  isRunningTestCases: boolean;
  isSuccessRunningTestCases: boolean;
  isErrorRunningTestCases: boolean;
  errorRunningTestCases: unknown;

  updateCode: (newCode: string) => void;
  changeLanguage: (newLanguage: ProgrammingLanguageEnum) => void;
  runCode: () => Promise<IRunTestsResult | undefined>;
  resetCode: () => void;
  formatCode: () => void;
  clearExecutionResult: () => void;
}

interface CodeEditorProviderProps {
  children: ReactNode;
  problemSlug: string;
  initialLanguage?: ProgrammingLanguageEnum;
  initialCode?: string;
}

const CodeEditorContext = createContext<CodeEditorContextProps | undefined>(undefined);

export function CodeEditorProvider({ children, problemSlug, initialLanguage, initialCode }: CodeEditorProviderProps) {
  const codeEditorProps = useCodeEditor({
    problemSlug,
    initialLanguage,
    initialCode,
  });

  return <CodeEditorContext.Provider value={codeEditorProps}>{children}</CodeEditorContext.Provider>;
}

export function useCodeEditorContext() {
  const context = useContext(CodeEditorContext);

  if (context === undefined) {
    throw new Error("useCodeEditorContext must be used within a CodeEditorProvider");
  }

  return context;
}
