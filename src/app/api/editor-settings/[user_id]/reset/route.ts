import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
import { EditorSettings } from "@/lib/db/models/editorSettings.model";
import { DEFAULT_EDITOR_SETTINGS } from "@/constants/editor";

export const POST = apiHandler(
  async (_, params: Promise<{ user_id: string }>) => {
    const { user_id } = await params;

    let editorSettings = await EditorSettings.findOne({ user: user_id });

    if (!editorSettings) {
      editorSettings = await EditorSettings.create({
        user: user_id,
        settings: DEFAULT_EDITOR_SETTINGS,
      });
    } else {
      editorSettings.settings = DEFAULT_EDITOR_SETTINGS;
      await editorSettings.save();
    }

    return { data: editorSettings.settings, status: StatusCodes.OK };
  }
);
