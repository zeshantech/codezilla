import { useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

// Panel types that can be shown or hidden
export enum PanelType {
  Problem = "problem",
  Editor = "editor",
  Console = "console",
}

// Layout presets
export enum LayoutPreset {
  Default = "default",
  Focus = "focus",
  Custom = "custom",
}

export interface PanelConfig {
  visible: boolean;
  size: number;
  minSize: number;
}

export interface Layout {
  name: LayoutPreset;
  panels: Record<PanelType, PanelConfig>;
}

// Define default layouts
const DEFAULT_LAYOUTS: Record<LayoutPreset, Layout> = {
  [LayoutPreset.Default]: {
    name: LayoutPreset.Default,
    panels: {
      [PanelType.Problem]: { visible: true, size: 40, minSize: 30 },
      [PanelType.Editor]: { visible: true, size: 60, minSize: 40 },
      [PanelType.Console]: { visible: true, size: 40, minSize: 20 },
    },
  },
  [LayoutPreset.Focus]: {
    name: LayoutPreset.Focus,
    panels: {
      [PanelType.Problem]: { visible: false, size: 40, minSize: 30 },
      [PanelType.Editor]: { visible: true, size: 80, minSize: 50 },
      [PanelType.Console]: { visible: true, size: 20, minSize: 20 },
    },
  },
  [LayoutPreset.Custom]: {
    name: LayoutPreset.Custom,
    panels: {
      [PanelType.Problem]: { visible: true, size: 40, minSize: 30 },
      [PanelType.Editor]: { visible: true, size: 60, minSize: 40 },
      [PanelType.Console]: { visible: true, size: 40, minSize: 20 },
    },
  },
};

export function useEditorLayout() {
  // Load the saved layout from localStorage or use default
  const [currentLayoutName, setCurrentLayoutName] =
    useLocalStorage<LayoutPreset>("editor-layout", LayoutPreset.Default);

  // Load custom layout settings if any are saved
  const [customLayout, setCustomLayout] = useLocalStorage<Layout>(
    "editor-custom-layout",
    DEFAULT_LAYOUTS[LayoutPreset.Custom]
  );

  // Current active layout
  const [currentLayout, setCurrentLayout] = useState<Layout>(
    currentLayoutName === LayoutPreset.Custom
      ? customLayout
      : DEFAULT_LAYOUTS[currentLayoutName]
  );

  // Update panel size
  const updatePanelSize = useCallback(
    (panelType: PanelType, size: number) => {
      setCurrentLayout((prevLayout) => {
        const newLayout = {
          ...prevLayout,
          name: LayoutPreset.Custom,
          panels: {
            ...prevLayout.panels,
            [panelType]: {
              ...prevLayout.panels[panelType],
              size,
            },
          },
        };

        // Save to custom layout
        setCustomLayout(newLayout);
        setCurrentLayoutName(LayoutPreset.Custom);
        return newLayout;
      });
    },
    [setCustomLayout, setCurrentLayoutName]
  );

  // Apply a layout preset
  const applyLayout = useCallback(
    (preset: LayoutPreset) => {
      if (preset === LayoutPreset.Custom) {
        setCurrentLayout(customLayout);
      } else {
        setCurrentLayout(DEFAULT_LAYOUTS[preset]);
      }
      setCurrentLayoutName(preset);
    },
    [customLayout, setCurrentLayoutName]
  );

  // Reset to default layout
  const resetLayout = useCallback(() => {
    applyLayout(LayoutPreset.Default);
  }, [applyLayout]);

  return {
    currentLayout,
    currentLayoutName,
    updatePanelSize,
    applyLayout,
    resetLayout,
  };
}

export default useEditorLayout;
