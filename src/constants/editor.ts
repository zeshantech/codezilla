import { ProgrammingLanguageEnum, IEditorSettings } from "@/types";

export const DEFAULT_EDITOR_SETTINGS: IEditorSettings = {
  theme: "dark",
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  showLineNumbers: true,
  showMinimap: false,
  autoComplete: true,
  formatOnSave: true,
  keyboardShortcuts: {
    format: true,
    save: true,
    run: true,
    reset: true,
  },
  indentUsingSpaces: true,
  highlightActiveLine: true,
  highlightGutter: true,
  showInvisibles: false,
  enableLigatures: true,
  enableSnippets: true,
  language: ProgrammingLanguageEnum.JAVASCRIPT,
};
