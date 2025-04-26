"use client";

import { useState, useCallback, useEffect } from "react";
import { EditorConfig, ProgrammingLanguage } from "@/types";

export interface EditorSettings extends EditorConfig {
  keyboardShortcuts: Record<string, boolean>;
  indentUsingSpaces: boolean;
  highlightActiveLine: boolean;
  highlightGutter: boolean;
  showInvisibles: boolean;
  enableLigatures: boolean;
  enableSnippets: boolean;
  language: ProgrammingLanguage;
}

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
  language: "javascript",
};

export function useEditorSettings() {
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("editor-settings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load settings:", error);
      setIsLoaded(true);
    }
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<EditorSettings>) => {
    setSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings, ...newSettings };

      // Save to localStorage
      try {
        localStorage.setItem(
          "editor-settings",
          JSON.stringify(updatedSettings)
        );
      } catch (error) {
        console.error("Failed to save settings:", error);
      }

      return updatedSettings;
    });
  }, []);

  // Reset settings to default
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem("editor-settings", JSON.stringify(DEFAULT_SETTINGS));
    } catch (error) {
      console.error("Failed to save default settings:", error);
    }
  }, []);

  // Update a single setting
  const updateSetting = useCallback(
    <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
      setSettings((prevSettings) => {
        const updatedSettings = { ...prevSettings, [key]: value };

        // Save to localStorage
        try {
          localStorage.setItem(
            "editor-settings",
            JSON.stringify(updatedSettings)
          );
        } catch (error) {
          console.error("Failed to save settings:", error);
        }

        return updatedSettings;
      });
    },
    []
  );

  // Toggle boolean settings
  const toggleSetting = useCallback((key: keyof EditorSettings) => {
    setSettings((prevSettings) => {
      const currentValue = prevSettings[key];
      if (typeof currentValue !== "boolean") {
        return prevSettings;
      }

      const updatedSettings = {
        ...prevSettings,
        [key]: !currentValue,
      };

      // Save to localStorage
      try {
        localStorage.setItem(
          "editor-settings",
          JSON.stringify(updatedSettings)
        );
      } catch (error) {
        console.error("Failed to save settings:", error);
      }

      return updatedSettings;
    });
  }, []);

  // Extract editor config from settings
  const getEditorConfig = useCallback((): EditorConfig => {
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
    updateSettings,
    resetSettings,
    updateSetting,
    toggleSetting,
    getEditorConfig,
  };
}

export default useEditorSettings;
