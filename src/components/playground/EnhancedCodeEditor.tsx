import { useRef, useEffect } from "react";
import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import { ProgrammingLanguage } from "@/types";
import useEditorSettings from "@/hooks/useEditorSettings";
import EditorToolbar from "./EditorToolbar";
import { Spinner } from "../ui/spinner";

interface EnhancedCodeEditorProps {
  code: string;
  language: ProgrammingLanguage;
  onChange: (value: string) => void;
  onSave: () => void;
  onFormat: () => void;
  onRun: () => void;
  onReset: () => void;
  readOnly?: boolean;
  autoFocus?: boolean;
  onChangeLanguage: (language: ProgrammingLanguage) => void;
}

export function EnhancedCodeEditor({ code, language, onChange, onSave, onFormat, onRun, onReset, readOnly = false, autoFocus = false, onChangeLanguage }: EnhancedCodeEditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const { settings } = useEditorSettings();

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
    monacoRef.current = monaco;

    // Define editor themes
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

    // Set the theme
    monaco.editor.setTheme(settings.theme === "dark" ? "logiclab-dark" : "logiclab-light");

    // Register keyboard shortcuts if enabled
    if (settings.keyboardShortcuts.format && onFormat) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => onFormat());
    }

    if (settings.keyboardShortcuts.save && onSave) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => onSave());
    }

    if (settings.keyboardShortcuts.run && onRun) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRun());
    }

    if (settings.keyboardShortcuts.reset && onReset) {
      editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyR, () => onReset());
    }

    // Focus editor if autoFocus is true
    if (autoFocus) {
      editor.focus();
    }
  };

  // Update editor options when settings change
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const monaco = monacoRef.current;
      const editor = editorRef.current;

      // Update theme
      monaco.editor.setTheme(settings.theme === "dark" ? "logiclab-dark" : "logiclab-light");

      // Update editor settings
      editor.updateOptions({
        readOnly,
        fontSize: settings.fontSize,
        tabSize: settings.tabSize,
        insertSpaces: settings.indentUsingSpaces,
        fontLigatures: settings.enableLigatures,
        minimap: { enabled: settings.showMinimap },
        lineNumbers: settings.showLineNumbers ? "on" : "off",
        wordWrap: settings.wordWrap ? "on" : "off",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        renderWhitespace: settings.showInvisibles ? "all" : "selection",
        cursorStyle: "line",
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        smoothScrolling: true,
        mouseWheelZoom: true,
        roundedSelection: true,
        selectOnLineNumbers: true,
        formatOnPaste: true,
        formatOnType: false,
        folding: true,
        glyphMargin: false,
        renderLineHighlight: settings.highlightActiveLine ? "all" : "none",
        suggestOnTriggerCharacters: settings.autoComplete,
        snippetSuggestions: settings.enableSnippets ? "inline" : "none",
        quickSuggestions: settings.autoComplete,
        parameterHints: { enabled: settings.autoComplete },
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true,
          highlightActiveIndentation: true,
        },
      });

      // Assign keyboard shortcuts
      if (settings.keyboardShortcuts.format && onFormat) {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => onFormat());
      }

      if (settings.keyboardShortcuts.save && onSave) {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => onSave());
      }

      if (settings.keyboardShortcuts.run && onRun) {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRun());
      }

      if (settings.keyboardShortcuts.reset && onReset) {
        editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyR, () => onReset());
      }
    }
  }, [settings, readOnly, onFormat, onSave, onRun, onReset]);

  // Handle code changes
  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  // Public method to format code
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run();
    }
  };

  // Format on save if enabled
  useEffect(() => {
    if (settings.formatOnSave && onSave) {
      const handleSave = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          formatCode();
          onSave();
        }
      };

      window.addEventListener("keydown", handleSave);
      return () => {
        window.removeEventListener("keydown", handleSave);
      };
    }
  }, [settings.formatOnSave, onSave]);

  return (
    <div className="h-full w-full">
      <EditorToolbar language={language} isSaving={false} hasChanges={false} onSave={onSave} onReset={onReset} onFormat={onFormat} onChangeLanguage={onChangeLanguage} />
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={settings.theme === "dark" ? "logiclab-dark" : "logiclab-light"}
        loading={
          <div className="flex items-center justify-center h-full">
            <Spinner>Loading editor...</Spinner>
          </div>
        }
        options={{
          readOnly,
          fontFamily: '"Fira Code", monospace',
          contextmenu: true,
        }}
      />
    </div>
  );
}

export default EnhancedCodeEditor;
