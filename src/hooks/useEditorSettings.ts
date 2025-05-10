"use client";

import { useState, useCallback, useEffect } from "react";
import { IEditorConfig, ProgrammingLanguageEnum } from "@/types";
import * as editorSettingsAPI from "@/lib/api/editorSettings/index";
import { toast } from "sonner";

export interface EditorSettings extends IEditorConfig {
  keyboardShortcuts: Record<string, boolean>;
  indentUsingSpaces: boolean;
  highlightActiveLine: boolean;
  highlightGutter: boolean;
  showInvisibles: boolean;
  enableLigatures: boolean;
  enableSnippets: boolean;
  language: ProgrammingLanguageEnum;
}

// Use a default user ID for now
const DEFAULT_USER_ID = "user123";

const DEFAULT_SETTINGS: EditorSettings = {
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

export function useEditorSettings(userId = DEFAULT_USER_ID) {
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Generate storage key using user ID for multi-user support
  const storageKey = `editor-settings-${userId}`;

  // Load settings from localStorage and server on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // First try to load from localStorage for immediate UI display
        const localSettings = localStorage.getItem(storageKey);
        if (localSettings) {
          setSettings(JSON.parse(localSettings));
        }

        // Then try to load from server (which will be more up-to-date)
        const serverSettings = await editorSettingsAPI.fetchEditorSettings(userId);
        if (serverSettings) {
          setSettings(serverSettings);
          // Update localStorage with server settings
          localStorage.setItem(storageKey, JSON.stringify(serverSettings));
        }

        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load settings:", error);
        setIsLoaded(true);
      }
    };

    loadSettings();
  }, [storageKey, userId]);

  // Update settings both locally and on the server
  const updateSettings = useCallback(
    async (newSettings: Partial<EditorSettings>) => {
      setIsSaving(true);

      try {
        const updatedSettings = { ...settings, ...newSettings };

        // Update local state and localStorage
        setSettings(updatedSettings);
        localStorage.setItem(storageKey, JSON.stringify(updatedSettings));

        // Update server
        await editorSettingsAPI.updateEditorSettings(userId, updatedSettings);
        toast.success("Settings saved successfully");
      } catch (error) {
        console.error("Failed to save settings:", error);
        toast.error("Failed to save settings");
      } finally {
        setIsSaving(false);
      }
    },
    [settings, storageKey, userId]
  );

  // Reset settings to default both locally and on the server
  const resetSettings = useCallback(async () => {
    setIsSaving(true);

    try {
      // Update local state and localStorage
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem(storageKey, JSON.stringify(DEFAULT_SETTINGS));

      // Reset on server
      await editorSettingsAPI.resetEditorSettings(userId);
      toast.success("Settings reset to defaults");
    } catch (error) {
      console.error("Failed to reset settings:", error);
      toast.error("Failed to reset settings");
    } finally {
      setIsSaving(false);
    }
  }, [storageKey, userId]);

  // Update a single setting both locally and on the server
  const updateSetting = useCallback(
    async <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
      setIsSaving(true);

      try {
        const updatedSettings = { ...settings, [key]: value };

        // Update local state and localStorage
        setSettings(updatedSettings);
        localStorage.setItem(storageKey, JSON.stringify(updatedSettings));

        // Update server
        await editorSettingsAPI.updateEditorSettings(userId, updatedSettings);
        toast.success("Setting updated successfully");
      } catch (error) {
        console.error("Failed to update setting:", error);
        toast.error("Failed to update setting");
      } finally {
        setIsSaving(false);
      }
    },
    [settings, storageKey, userId]
  );

  // Toggle boolean setting both locally and on the server
  const toggleSetting = useCallback(
    async (key: keyof EditorSettings) => {
      const currentValue = settings[key];
      if (typeof currentValue !== "boolean") {
        return;
      }

      await updateSetting(key, !currentValue as any);
    },
    [settings, updateSetting]
  );

  // Extract editor config from settings
  const getEditorConfig = useCallback((): IEditorConfig => {
    return {
      theme: settings.theme,
      fontSize: settings.fontSize,
      tabSize: settings.tabSize,
      wordWrap: settings.wordWrap,
      showLineNumbers: settings.showLineNumbers,
      showMinimap: settings.showMinimap,
      autoComplete: settings.autoComplete,
      formatOnSave: settings.formatOnSave,
    };
  }, [settings]);

  return {
    settings,
    isLoaded,
    isSaving,
    updateSettings,
    resetSettings,
    updateSetting,
    toggleSetting,
    getEditorConfig,
  };
}

export default useEditorSettings;
