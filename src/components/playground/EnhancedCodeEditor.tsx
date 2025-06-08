import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import { ProgrammingLanguageEnum } from "@/types/enums";
import { IEditorSettings } from "@/types/editor";
import useEditorSettings from "@/hooks/useEditorSettings";
import EditorToolbar from "./EditorToolbar";
import { Spinner } from "../ui/spinner";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { DEFAULT_EDITOR_SETTINGS } from "@/constants/editor";
import debounce from "lodash.debounce";

interface EnhancedCodeEditorProps {
  readOnly?: boolean;
  autoFocus?: boolean;
}

export function EnhancedCodeEditor({ readOnly = false, autoFocus = false }: EnhancedCodeEditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const code = useCodeEditorStore((state) => state.code);
  const language = useCodeEditorStore((state) => state.language);
  const updateCode = useCodeEditorStore((state) => state.updateCode);
  const formatCode = useCodeEditorStore((state) => state.formatCode);
  const executeCode = useCodeEditorStore((state) => state.executeCode);
  const resetCode = useCodeEditorStore((state) => state.resetCode);
  const saveCode = useCodeEditorStore((state) => state.saveCode);

  const { settings, isSettingsLoading, updateSettings, isResetSettingsPending, resetSettings } = useEditorSettings();

  const [effectiveSettings, setEffectiveSettings] = useState<IEditorSettings>(DEFAULT_EDITOR_SETTINGS);

  useEffect(() => {
    if (settings) {
      setEffectiveSettings(settings);
    }
  }, [settings]);

  const debouncedUpdateSettings = useCallback(
    debounce((newSettings: Partial<IEditorSettings>) => {
      updateSettings(newSettings);
    }, 5000),
    [updateSettings]
  );

  // Handle local settings change
  const handleSettingChange = (newSettings: Partial<IEditorSettings>) => {
    const updatedSettings = { ...effectiveSettings, ...newSettings };
    setEffectiveSettings(updatedSettings);
    debouncedUpdateSettings(newSettings);
  };

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

  // Handle editor mounting
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define editor themes
    monaco.editor.defineTheme("codezilla-dark", {
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

    monaco.editor.defineTheme("codezilla-light", {
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
    monaco.editor.setTheme(effectiveSettings.theme === "dark" ? "codezilla-dark" : "codezilla-light");

    // Register keyboard shortcuts if enabled
    if (effectiveSettings.keyboardShortcuts.format && formatCode) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => formatCode());
    }

    if (effectiveSettings.keyboardShortcuts.save && saveCode) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => saveCode());
    }

    if (effectiveSettings.keyboardShortcuts.run && executeCode) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => executeCode());
    }

    if (effectiveSettings.keyboardShortcuts.reset && resetCode) {
      editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyR, () => resetCode());
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
      monaco.editor.setTheme(effectiveSettings.theme === "dark" ? "codezilla-dark" : "codezilla-light");

      // Update editor settings
      editor.updateOptions({
        readOnly,
        fontSize: effectiveSettings.fontSize,
        tabSize: effectiveSettings.tabSize,
        insertSpaces: effectiveSettings.indentUsingSpaces,
        fontLigatures: effectiveSettings.enableLigatures,
        minimap: { enabled: effectiveSettings.showMinimap },
        lineNumbers: effectiveSettings.showLineNumbers ? "on" : "off",
        wordWrap: effectiveSettings.wordWrap ? "on" : "off",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        renderWhitespace: effectiveSettings.showInvisibles ? "all" : "selection",
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
        renderLineHighlight: effectiveSettings.highlightActiveLine ? "all" : "none",
        suggestOnTriggerCharacters: effectiveSettings.autoComplete,
        snippetSuggestions: effectiveSettings.enableSnippets ? "inline" : "none",
        quickSuggestions: effectiveSettings.autoComplete,
        parameterHints: { enabled: effectiveSettings.autoComplete },
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true,
          highlightActiveIndentation: true,
        },
      });

      // Assign keyboard shortcuts
      if (effectiveSettings.keyboardShortcuts.format && formatCode) {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => formatCode());
      }

      if (effectiveSettings.keyboardShortcuts.save && saveCode) {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => saveCode());
      }

      if (effectiveSettings.keyboardShortcuts.run && executeCode) {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => executeCode());
      }

      if (effectiveSettings.keyboardShortcuts.reset && resetCode) {
        editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyR, () => resetCode());
      }
    }
  }, [effectiveSettings, readOnly, formatCode, saveCode, executeCode, resetCode]);

  // Handle code changes
  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined) {
      updateCode(value);
    }
  };

  // Format on save if enabled
  useEffect(() => {
    if (effectiveSettings.formatOnSave && saveCode) {
      const handleSave = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          formatCode();
          saveCode();
        }
      };

      window.addEventListener("keydown", handleSave);
      return () => {
        window.removeEventListener("keydown", handleSave);
      };
    }
  }, [effectiveSettings.formatOnSave, saveCode]);

  // Handle loading a submission from history

  return (
    <div className="h-full w-full">
      <EditorToolbar onChangeSettings={handleSettingChange} settings={effectiveSettings} resetSettings={resetSettings} />

      {(isSettingsLoading || isResetSettingsPending) && <Spinner className="absolute bottom-2 right-2 z-10" />}

      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={effectiveSettings.theme === "dark" ? "codezilla-dark" : "codezilla-light"}
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
