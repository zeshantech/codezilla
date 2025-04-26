import React, { createContext, useContext } from "react";
import useEditorLayout, {
  PanelType,
  LayoutPreset,
  Layout,
} from "@/hooks/useEditorLayout";

interface EditorLayoutContextType {
  currentLayout: Layout;
  currentLayoutName: LayoutPreset;
  togglePanelVisibility: (panel: PanelType) => void;
  updatePanelSize: (panel: PanelType, size: number) => void;
  updatePanelPosition: (panel: PanelType, x: number, y: number) => void;
  togglePanelFloating: (panel: PanelType) => void;
  applyLayout: (preset: LayoutPreset) => void;
  resetLayout: () => void;
  layoutPresets: Layout[];
}

const EditorLayoutContext = createContext<EditorLayoutContextType | undefined>(
  undefined
);

export function EditorLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const layoutHook = useEditorLayout();

  return (
    <EditorLayoutContext.Provider value={layoutHook}>
      {children}
    </EditorLayoutContext.Provider>
  );
}

export function useEditorLayoutContext() {
  const context = useContext(EditorLayoutContext);
  if (context === undefined) {
    throw new Error(
      "useEditorLayoutContext must be used within a EditorLayoutProvider"
    );
  }
  return context;
}

export default EditorLayoutProvider;
