"use client";

import { useRef, useEffect } from "react";
import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import { ProgrammingLanguageEnum, IEditorConfig } from "@/types";
import { Loader2 } from "lucide-react";

interface CodeEditorProps {
  code: string;
  language: ProgrammingLanguageEnum;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
}

const DEFAULT_EDITOR_CONFIG: IEditorConfig = {
  theme: "dark",
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  showLineNumbers: true,
  showMinimap: false,
  autoComplete: true,
  formatOnSave: true,
};

export function CodeEditor({
  code,
  language,
  onChange,
  height = "100%",
  readOnly = false,
  autoFocus = false,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  // Convert language codes to Monaco-compatible values
  const getMonacoLanguage = (lang: ProgrammingLanguageEnum) => {
    switch (lang) {
      case "javascript":
        return "javascript";
      case "python":
        return "python";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      default:
        return "javascript";
    }
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme("logiclab-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1a1b26",
        "editor.foreground": "#a9b1d6",
        "editor.lineHighlightBackground": "#2a2b36",
        "editor.selectionBackground": "#3d59a1",
        "editor.selectionHighlightBackground": "#3d59a155",
        "editorCursor.foreground": "#c0caf5",
        "editorLineNumber.foreground": "#565f89",
        "editorLineNumber.activeForeground": "#c0caf5",
      },
    });

    monaco.editor.defineTheme("logiclab-light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#f5f5f5",
        "editor.foreground": "#24283b",
        "editor.lineHighlightBackground": "#e6e8ec",
        "editor.selectionBackground": "#c0caf5",
        "editor.selectionHighlightBackground": "#c0caf555",
        "editorCursor.foreground": "#24283b",
        "editorLineNumber.foreground": "#9aa5ce",
        "editorLineNumber.activeForeground": "#24283b",
      },
    });

    monaco.editor.setTheme(
      DEFAULT_EDITOR_CONFIG.theme === "dark"
        ? "logiclab-dark"
        : "logiclab-light"
    );

    // Configure editor settings
    editor.updateOptions({
      readOnly,
      fontSize: DEFAULT_EDITOR_CONFIG.fontSize ?? 14,
      tabSize: DEFAULT_EDITOR_CONFIG.tabSize ?? 2,
      minimap: { enabled: DEFAULT_EDITOR_CONFIG.showMinimap ?? false },
      lineNumbers: DEFAULT_EDITOR_CONFIG.showLineNumbers ? "on" : "off",
      wordWrap: DEFAULT_EDITOR_CONFIG.wordWrap ? "on" : "off",
      scrollBeyondLastLine: false,
      automaticLayout: true,
      snippetSuggestions: DEFAULT_EDITOR_CONFIG.autoComplete ? "on" : "off",
      suggest: { showKeywords: DEFAULT_EDITOR_CONFIG.autoComplete ?? true },
      quickSuggestions: DEFAULT_EDITOR_CONFIG.autoComplete ?? true,
      parameterHints: { enabled: DEFAULT_EDITOR_CONFIG.autoComplete ?? true },
    });

    // Auto-focus if specified
    if (autoFocus) {
      editor.focus();
    }
  };

  // Handle code changes
  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  // Format code when needed
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run();
    }
  };

  // Format on save if enabled
  useEffect(() => {
    if (DEFAULT_EDITOR_CONFIG.formatOnSave) {
      const interval = setInterval(() => {
        if (editorRef.current) {
          formatCode();
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [DEFAULT_EDITOR_CONFIG.formatOnSave]);

  return (
    <div className="h-full w-full">
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={
          DEFAULT_EDITOR_CONFIG.theme === "dark"
            ? "logiclab-dark"
            : "logiclab-light"
        }
        loading={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Loading editor...</span>
          </div>
        }
        options={{
          readOnly,
          contextmenu: true,
          scrollBeyondLastLine: false,
          fontFamily: '"Fira Code", monospace',
          fontLigatures: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          mouseWheelZoom: true,
          copyWithSyntaxHighlighting: true,
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          renderWhitespace: "selection",
        }}
      />
    </div>
  );
}

export default CodeEditor;
