import { EditorSettings } from "@/hooks/useEditorSettings";
import api from "../api";

// Get editor settings for a user
export const fetchEditorSettings = async (userId: string): Promise<EditorSettings | null> => {
  const response = await api(`/api/editor-settings/${userId}`);
  return response.data?.settings || null;
};

// Update editor settings for a user
export const updateEditorSettings = async (userId: string, settings: EditorSettings): Promise<EditorSettings | null> => {
  const response = await api.put(`/api/editor-settings/${userId}`, { settings });

  return response.data?.settings || null;
};

// Reset editor settings to default for a user
export const resetEditorSettings = async (userId: string): Promise<boolean> => {
  const response = await api.post(`/api/editor-settings/${userId}/reset`);
  return response.data?.success || false;
};
