"use client";

import { useCallback } from "react";
import * as editorSettingsAPI from "@/lib/api/editorSettings/index";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DEFAULT_EDITOR_SETTINGS } from "@/constants/editor";
import { IEditorSettings } from "@/types/editor";

export function useEditorSettings() {
  const USER_ID = "user123";
  const queryClient = useQueryClient();

  const useGetEditorSettings = () => {
    return useQuery({
      queryKey: ["editor-settings", USER_ID],
      queryFn: async () => {
        const result = await editorSettingsAPI.fetchEditorSettings(USER_ID);

        return result;
      },
      staleTime: 1000 * 60 * 5,
    });
  };

  const useUpdateEditorSettings = () => {
    return useMutation({
      mutationFn: (settings: IEditorSettings) => editorSettingsAPI.updateEditorSettings(USER_ID, settings),
      onError: () => {
        toast.error("Failed to update settings");
      },
    });
  };

  const useResetEditorSettings = () => {
    return useMutation({
      mutationFn: () => editorSettingsAPI.resetEditorSettings(USER_ID),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["editor-settings", USER_ID],
        });
      },
      onError: () => {
        toast.error("Failed to reset settings");
      },
    });
  };

  const settingsQuery = useGetEditorSettings();
  const updateSettingsMutation = useUpdateEditorSettings();
  const resetSettingsMutation = useResetEditorSettings();

  const updateSettings = useCallback(
    (partialSettings: Partial<IEditorSettings>) => {
      const currentSettings = settingsQuery.data || DEFAULT_EDITOR_SETTINGS;
      const mergedSettings = { ...currentSettings, ...partialSettings };
      return updateSettingsMutation.mutate(mergedSettings);
    },
    [updateSettingsMutation, settingsQuery.data]
  );

  const resetSettings = useCallback(() => {
    return resetSettingsMutation.mutate();
  }, [resetSettingsMutation]);

  return {
    useGetEditorSettings,
    settings: settingsQuery.data || DEFAULT_EDITOR_SETTINGS,
    settingsError: settingsQuery.error,
    isSettingsLoading: settingsQuery.isLoading,
    isSettingsError: settingsQuery.error,
    isSettingsSuccess: settingsQuery.isSuccess,

    useUpdateEditorSettings,
    updateSettings,
    isUpdateSettingsError: updateSettingsMutation.isError,
    updateSettingsError: updateSettingsMutation.error,
    isUpdateSettingsPending: updateSettingsMutation.isPending,
    isUpdateSettingsSuccess: updateSettingsMutation.isSuccess,

    useResetEditorSettings,
    resetSettings,
    isResetSettingsError: resetSettingsMutation.isError,
    resetSettingsError: resetSettingsMutation.error,
    isResetSettingsPending: resetSettingsMutation.isPending,
    isResetSettingsSuccess: resetSettingsMutation.isSuccess,
  };
}

export default useEditorSettings;
