import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
import dbConnect from "@/lib/db/connection";
import { EditorSettings } from "@/lib/db/models/editorSettings.model";
import { EditorSettings as DefaultEditorSettings } from "@/hooks/useEditorSettings";
import { ProgrammingLanguageEnum } from "@/types";

// Default editor settings - must match the defaults in the hook
const DEFAULT_SETTINGS: DefaultEditorSettings = {
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

// POST /api/editor-settings/[userId]/reset
export const POST = apiHandler(async (request: NextRequest, { params }: { params: { userId: string } }) => {
  await dbConnect();

  const userId = params.userId;

  let editorSettings = await EditorSettings.findOne({ userId });

  if (!editorSettings) {
    // Create default settings if none exist
    editorSettings = await EditorSettings.create({
      userId,
      settings: DEFAULT_SETTINGS,
    });
  } else {
    // Reset to default settings
    editorSettings.settings = DEFAULT_SETTINGS;
    await editorSettings.save();
  }

  return { data: editorSettings, status: StatusCodes.OK };
});
