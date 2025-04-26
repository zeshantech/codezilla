"use client";

import { useRef, useEffect } from "react";
import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import { ProgrammingLanguage, EditorConfig } from "@/types";
import { Loader2 } from "lucide-react";

interface CodeEditorProps {
  code: string;
  language: ProgrammingLanguage;
  onChange: (value: string) => void;
  config?: Partial<EditorConfig>;
  height?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
}

export function CodeEditor({
  code,
  language,
  onChange,
  config = {},
  height = "100%",
  readOnly = false,
  autoFocus = false,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  // Convert language codes to Monaco-compatible values
  const getMonacoLanguage = (lang: ProgrammingLanguage) => {
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

  // Handle editor mounting
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Setup editor configuration
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

    // Set the theme based on config
    monaco.editor.setTheme(
      config.theme === "dark" ? "logiclab-dark" : "logiclab-light"
    );

    // Configure editor settings
    editor.updateOptions({
      readOnly,
      fontSize: config.fontSize ?? 14,
      tabSize: config.tabSize ?? 2,
      minimap: { enabled: config.showMinimap ?? false },
      lineNumbers: config.showLineNumbers ? "on" : "off",
      wordWrap: config.wordWrap ? "on" : "off",
      scrollBeyondLastLine: false,
      automaticLayout: true,
      snippetSuggestions: config.autoComplete ? "on" : "off",
      suggest: { showKeywords: config.autoComplete ?? true },
      quickSuggestions: config.autoComplete ?? true,
      parameterHints: { enabled: config.autoComplete ?? true },
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
    if (config.formatOnSave) {
      const interval = setInterval(() => {
        if (editorRef.current) {
          formatCode();
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [config.formatOnSave]);

  return (
    <div className="h-full w-full">
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={config.theme === "dark" ? "logiclab-dark" : "logiclab-light"}
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
