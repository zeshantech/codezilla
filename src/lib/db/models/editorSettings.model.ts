import { Schema, Document, Model, models, model } from "mongoose";
import { IEditorSettings } from "@/types/editor";
import toJSON from "@/lib/plugins/toJSON";

interface IEditorSettingsSchema {
  user: string;
  settings: IEditorSettings;
}

export interface EditorSettingsDocument
  extends IEditorSettingsSchema,
    Omit<Document, "id"> {}

const EditorSettingsSchema = new Schema<IEditorSettingsSchema>(
  {
    user: { type: String, required: true, unique: true },
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

export const EditorSettings: Model<IEditorSettingsSchema> =
  models?.EditorSettings ||
  model<IEditorSettingsSchema>("EditorSettings", EditorSettingsSchema);
