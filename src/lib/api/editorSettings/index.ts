import api from "../api";
import { IEditorSettings } from "@/types";

export const fetchEditorSettings = async (userId: string) => {
  const response = await api.get(`/editor-settings/${userId}`);

  return response.data;
};

export const updateEditorSettings = async (
  userId: string,
  settings: IEditorSettings
) => {
  const response = await api.put(`/editor-settings/${userId}`, { settings });

  return response.data;
};

export const resetEditorSettings = async (userId: string) => {
  const response = await api.post(`/editor-settings/${userId}/reset`);

  return response.data;
};
