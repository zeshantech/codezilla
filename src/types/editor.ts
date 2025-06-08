import { ProgrammingLanguageEnum } from "./enums";

export interface IEditorSettings {
  theme: "light" | "dark";
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  showLineNumbers: boolean;
  showMinimap: boolean;
  autoComplete: boolean;
  formatOnSave: boolean;
  keyboardShortcuts: Record<string, boolean>;
  indentUsingSpaces: boolean;
  highlightActiveLine: boolean;
  highlightGutter: boolean;
  showInvisibles: boolean;
  enableLigatures: boolean;
  enableSnippets: boolean;
  language: ProgrammingLanguageEnum;
}

export interface IEditorConfig {
  theme: "light" | "dark";
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  showLineNumbers: boolean;
  showMinimap: boolean;
  autoComplete: boolean;
  formatOnSave: boolean;
}
