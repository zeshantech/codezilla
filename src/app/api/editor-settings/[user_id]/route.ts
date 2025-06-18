import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/errorHandler";
import { StatusCodes } from "@/constants/statusCodes";
import { EditorSettings } from "@/lib/db/models/editorSettings.model";
import { DEFAULT_EDITOR_SETTINGS } from "@/constants/editor";

export const GET = apiHandler(async (_, params: Promise<{ user_id: string }>) => {
 const { user_id } = await params;

 let editorSettings = await EditorSettings.findOne({ user: user_id });

 if (!editorSettings) {
  editorSettings = await EditorSettings.create({
   user: user_id,
   settings: DEFAULT_EDITOR_SETTINGS,
  });
 }

 return { data: editorSettings.settings, status: StatusCodes.OK };
});

export const PUT = apiHandler(async (request: NextRequest, params: Promise<{ user_id: string }>) => {
 const { user_id } = await params;
 const { settings } = await request.json();

 const editorSettings = await EditorSettings.findOneAndUpdate({ user: user_id }, { $set: { settings: { ...DEFAULT_EDITOR_SETTINGS, ...settings } } }, { new: true, upsert: true });

 return { data: editorSettings.settings, status: StatusCodes.OK };
});
