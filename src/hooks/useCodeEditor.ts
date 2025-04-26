import { useState, useEffect, useCallback } from "react";
import { ProgrammingLanguage, EditorConfig, Problem } from "@/types";
import { toast } from "sonner";
import useCodeExecution from "./useCodeExecution";
import { CURRENT_USER } from "@/data/mock/users";

const DEFAULT_EDITOR_CONFIG: EditorConfig = {
  theme: "dark",
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  showLineNumbers: true,
  showMinimap: false,
  autoComplete: true,
  formatOnSave: true,
};

interface UseCodeEditorProps {
  problem?: Problem | null;
  initialLanguage?: ProgrammingLanguage;
  initialCode?: string;
}

export function useCodeEditor({
  problem,
  initialLanguage = "javascript",
  initialCode,
}: UseCodeEditorProps = {}) {
  const [code, setCode] = useState<string>(initialCode || "");
  const [language, setLanguage] =
    useState<ProgrammingLanguage>(initialLanguage);
  const [editorConfig, setEditorConfig] = useState<EditorConfig>(
    DEFAULT_EDITOR_CONFIG
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const { executeCode, executionResult, isExecuting, clearExecutionResult } =
    useCodeExecution();

  // If problem changes, update the code based on the starter code or saved user code
  useEffect(() => {
    if (problem) {
      // Check if user has saved progress for this problem
      const userProgress = problem.id
        ? CURRENT_USER.problemsProgress[problem.id]
        : undefined;

      if (userProgress?.code && userProgress.code[language]) {
        // User has saved code for this problem and language
        setCode(userProgress.code[language] || "");
      } else {
        // Use the problem's starter code
        setCode(problem.starterCode[language] || "");
      }

      // Reset execution results when problem changes
      clearExecutionResult();
      setIsDirty(false);
    }
  }, [problem, language, clearExecutionResult]);

  // Handle language change
  const changeLanguage = useCallback(
    (newLanguage: ProgrammingLanguage) => {
      if (language !== newLanguage) {
        if (isDirty) {
          // Ask for confirmation if there are unsaved changes
          const confirmChange = window.confirm(
            "Changing language will reset your current code. Continue?"
          );

          if (!confirmChange) return;
        }

        setLanguage(newLanguage);

        // Update code for the new language
        if (problem) {
          const userProgress = problem.id
            ? CURRENT_USER.problemsProgress[problem.id]
            : undefined;

          if (userProgress?.code && userProgress.code[newLanguage]) {
            setCode(userProgress.code[newLanguage] || "");
          } else {
            setCode(problem.starterCode[newLanguage] || "");
          }
        }

        setIsDirty(false);
        clearExecutionResult();
      }
    },
    [language, isDirty, problem, clearExecutionResult]
  );

  // Handle code change
  const updateCode = useCallback((newCode: string) => {
    setCode(newCode);
    setIsDirty(true);
  }, []);

  // Run code
  const runCode = useCallback(async () => {
    if (!code.trim()) {
      toast.error("Code cannot be empty!");
      return;
    }

    await executeCode({
      code,
      language,
      problemId: problem?.id,
    });
  }, [code, language, problem, executeCode]);

  // Reset code to starter code
  const resetCode = useCallback(() => {
    if (problem) {
      const confirmReset = window.confirm(
        "Are you sure you want to reset your code to the starter code?"
      );

      if (confirmReset) {
        setCode(problem.starterCode[language] || "");
        setIsDirty(false);
        clearExecutionResult();
        toast.info("Code has been reset to starter code");
      }
    }
  }, [problem, language, clearExecutionResult]);

  // Save code (simulate API call)
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

  // Update editor configuration
  const updateEditorConfig = useCallback((config: Partial<EditorConfig>) => {
    setEditorConfig((prev) => ({ ...prev, ...config }));
  }, []);

  // Format code (simplified implementation)
  const formatCode = useCallback(() => {
    // In a real app, this would use a proper code formatter like prettier
    // This is a very simple indentation-based formatter for demo purposes

    try {
      if (
        language === "javascript" ||
        language === "java" ||
        language === "cpp"
      ) {
        // For C-style languages, try to pretty-print the code (very basic)
        const formatted = code
          .split("\n")
          .map((line) => line.trim())
          .join("\n");

        setCode(formatted);
        toast.success("Code formatted");
      } else {
        // For other languages, just trim whitespace
        setCode(code.trim());
        toast.success("Code formatted");
      }
    } catch (error) {
      toast.error("Failed to format code");
    }
  }, [code, language]);

  return {
    code,
    language,
    editorConfig,
    isSaving,
    isDirty,
    executionResult,
    isExecuting,
    updateCode,
    changeLanguage,
    runCode,
    resetCode,
    saveCode,
    updateEditorConfig,
    formatCode,
    clearExecutionResult,
  };
}

export default useCodeEditor;
