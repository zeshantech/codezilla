import { useState, useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

// Panel types that can be shown or hidden
export enum PanelType {
  Problem = "problem",
  Notes = "notes",
  Editor = "editor",
  Console = "console",
  AiHelp = "aiHelp",
}

// Layout presets
export enum LayoutPreset {
  Default = "default",
  Coding = "coding",
  Learning = "learning",
  Minimal = "minimal",
  Custom = "custom",
}

export interface PanelConfig {
  visible: boolean;
  size: number;
  minSize: number;
  position?: {
    x: number;
    y: number;
  };
  isFloating?: boolean;
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
      [PanelType.Problem]: { visible: true, size: 70, minSize: 40 },
      [PanelType.Notes]: {
        visible: true,
        size: 30,
        minSize: 20,
        isFloating: false,
      },
      [PanelType.Editor]: { visible: true, size: 70, minSize: 40 },
      [PanelType.Console]: { visible: true, size: 50, minSize: 20 },
      [PanelType.AiHelp]: {
        visible: true,
        size: 50,
        minSize: 20,
        isFloating: false,
      },
    },
  },
  [LayoutPreset.Coding]: {
    name: LayoutPreset.Coding,
    panels: {
      [PanelType.Problem]: { visible: true, size: 40, minSize: 30 },
      [PanelType.Notes]: {
        visible: true,
        size: 40,
        minSize: 20,
        isFloating: true,
        position: { x: 20, y: 200 },
      },
      [PanelType.Editor]: { visible: true, size: 80, minSize: 50 },
      [PanelType.Console]: { visible: true, size: 60, minSize: 20 },
      [PanelType.AiHelp]: {
        visible: true,
        size: 40,
        minSize: 20,
        isFloating: true,
        position: { x: 20, y: 20 },
      },
    },
  },
  [LayoutPreset.Learning]: {
    name: LayoutPreset.Learning,
    panels: {
      [PanelType.Problem]: { visible: true, size: 60, minSize: 40 },
      [PanelType.Notes]: {
        visible: true,
        size: 40,
        minSize: 30,
        isFloating: false,
      },
      [PanelType.Editor]: { visible: true, size: 60, minSize: 40 },
      [PanelType.Console]: { visible: true, size: 40, minSize: 20 },
      [PanelType.AiHelp]: {
        visible: true,
        size: 50,
        minSize: 30,
        isFloating: false,
      },
    },
  },
  [LayoutPreset.Minimal]: {
    name: LayoutPreset.Minimal,
    panels: {
      [PanelType.Problem]: { visible: false, size: 70, minSize: 40 },
      [PanelType.Notes]: {
        visible: true,
        size: 40,
        minSize: 20,
        isFloating: true,
        position: { x: 20, y: 200 },
      },
      [PanelType.Editor]: { visible: true, size: 100, minSize: 50 },
      [PanelType.Console]: { visible: true, size: 30, minSize: 20 },
      [PanelType.AiHelp]: {
        visible: false,
        size: 50,
        minSize: 20,
        isFloating: true,
        position: { x: 20, y: 20 },
      },
    },
  },
  [LayoutPreset.Custom]: {
    name: LayoutPreset.Custom,
    panels: {
      [PanelType.Problem]: { visible: true, size: 70, minSize: 40 },
      [PanelType.Notes]: {
        visible: true,
        size: 30,
        minSize: 20,
        isFloating: false,
      },
      [PanelType.Editor]: { visible: true, size: 70, minSize: 40 },
      [PanelType.Console]: { visible: true, size: 50, minSize: 20 },
      [PanelType.AiHelp]: {
        visible: true,
        size: 50,
        minSize: 20,
        isFloating: false,
      },
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

  // Toggle a panel's visibility
  const togglePanelVisibility = useCallback(
    (panelType: PanelType) => {
      setCurrentLayout((prevLayout) => {
        const newLayout = {
          ...prevLayout,
          name: LayoutPreset.Custom,
          panels: {
            ...prevLayout.panels,
            [panelType]: {
              ...prevLayout.panels[panelType],
              visible: !prevLayout.panels[panelType].visible,
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

  // Update panel position (for floating panels)
  const updatePanelPosition = useCallback(
    (panelType: PanelType, x: number, y: number) => {
      setCurrentLayout((prevLayout) => {
        const newLayout = {
          ...prevLayout,
          name: LayoutPreset.Custom,
          panels: {
            ...prevLayout.panels,
            [panelType]: {
              ...prevLayout.panels[panelType],
              position: { x, y },
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

  // Toggle floating state for a panel
  const togglePanelFloating = useCallback(
    (panelType: PanelType) => {
      setCurrentLayout((prevLayout) => {
        const newLayout = {
          ...prevLayout,
          name: LayoutPreset.Custom,
          panels: {
            ...prevLayout.panels,
            [panelType]: {
              ...prevLayout.panels[panelType],
              isFloating: !prevLayout.panels[panelType].isFloating,
              // Set initial position if not already set
              position: prevLayout.panels[panelType].position || {
                x: 20,
                y: 20,
              },
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

  // Available layout presets
  const layoutPresets = useMemo(() => Object.values(DEFAULT_LAYOUTS), []);

  return {
    currentLayout,
    currentLayoutName,
    togglePanelVisibility,
    updatePanelSize,
    updatePanelPosition,
    togglePanelFloating,
    applyLayout,
    resetLayout,
    layoutPresets,
  };
}

export default useEditorLayout;
