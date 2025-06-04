import React, { createContext, useContext } from "react";
import useEditorLayout, {
  PanelType,
  LayoutPreset,
  Layout,
} from "@/hooks/useEditorLayout";

interface EditorLayoutContextType {
  currentLayout: Layout;
  currentLayoutName: LayoutPreset;
  updatePanelSize: (panel: PanelType, size: number) => void;
  applyLayout: (preset: LayoutPreset) => void;
  resetLayout: () => void;
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
