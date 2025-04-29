import { Schema, Document, Model, models, model } from "mongoose";
import { ProgrammingLanguage } from "@/types";
import toJSON from "@/lib/plugins/toJSON";

export interface EditorSettingsDocument extends Document {
  userId: string;
  settings: {
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
    language: ProgrammingLanguage;
  };
}

const EditorSettingsSchema = new Schema<EditorSettingsDocument>(
  {
    userId: { type: String, required: true, unique: true },
    settings: {
      theme: { type: String, enum: ["light", "dark"], default: "dark" },
      fontSize: { type: Number, default: 14 },
      tabSize: { type: Number, default: 2 },
      wordWrap: { type: Boolean, default: true },
      showLineNumbers: { type: Boolean, default: true },
      showMinimap: { type: Boolean, default: false },
      autoComplete: { type: Boolean, default: true },
      formatOnSave: { type: Boolean, default: true },
      keyboardShortcuts: {
        format: { type: Boolean, default: true },
        save: { type: Boolean, default: true },
        run: { type: Boolean, default: true },
        reset: { type: Boolean, default: true },
      },
      indentUsingSpaces: { type: Boolean, default: true },
      highlightActiveLine: { type: Boolean, default: true },
      highlightGutter: { type: Boolean, default: true },
      showInvisibles: { type: Boolean, default: false },
      enableLigatures: { type: Boolean, default: true },
      enableSnippets: { type: Boolean, default: true },
      language: {
        type: String,
        enum: ["javascript", "python", "java", "cpp"],
        default: "javascript",
      },
    },
  },
  {
    timestamps: true,
  }
);

EditorSettingsSchema.plugin(toJSON);

export const EditorSettings: Model<EditorSettingsDocument> = models?.EditorSettings || model<EditorSettingsDocument>("EditorSettings", EditorSettingsSchema);
