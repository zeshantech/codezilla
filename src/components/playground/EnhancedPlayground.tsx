"use client";

import { useCallback } from "react";
import { PanelType } from "@/hooks/useEditorLayout";
import { useEditorLayoutContext } from "@/providers/EditorLayoutProvider";
import { EnhancedCodeEditor } from "./EnhancedCodeEditor";
import { EnhancedConsole } from "./EnhancedConsole";
import { ProblemViewer } from "@/components/playground/ProblemViewer";
import EnhancedToolbar from "./EnhancedToolbar";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Card } from "@/components/ui/card";
import { debounce } from "@/lib/utils";

export function EnhancedPlayground() {
  const { currentLayout, updatePanelSize } = useEditorLayoutContext();

  // Debounced resize handler to prevent excessive updates
  const handlePanelResize = useCallback(
    debounce((panelType: PanelType, size: number) => {
      updatePanelSize(panelType, size);
    }, 3000),
    [updatePanelSize]
  );

  return (
    <div className="flex h-screen flex-col">
      <EnhancedToolbar />

      <div className="flex-1 relative overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {currentLayout.panels[PanelType.Problem].visible ? (
            <>
              <ResizablePanel defaultSize={currentLayout.panels[PanelType.Problem].size} minSize={currentLayout.panels[PanelType.Problem].minSize} className="p-2" onResize={(size) => handlePanelResize(PanelType.Problem, size)}>
                <Card className="h-full py-0 overflow-hidden">
                  <ProblemViewer />
                </Card>
              </ResizablePanel>
              <ResizableHandle />
            </>
          ) : null}

          <ResizablePanel defaultSize={currentLayout.panels[PanelType.Problem].visible ? 100 - currentLayout.panels[PanelType.Problem].size : 100} minSize={40}>
            <ResizablePanelGroup direction="vertical">
              {currentLayout.panels[PanelType.Editor].visible && (
                <>
                  <ResizablePanel defaultSize={currentLayout.panels[PanelType.Editor].size} minSize={currentLayout.panels[PanelType.Editor].minSize} className="p-2" onResize={(size) => handlePanelResize(PanelType.Editor, size)}>
                    <Card className="h-full py-0 overflow-hidden relative">
                      <EnhancedCodeEditor autoFocus />
                    </Card>
                  </ResizablePanel>

                  {currentLayout.panels[PanelType.Console].visible && (
                    <>
                      <ResizableHandle />
                      <ResizablePanel defaultSize={currentLayout.panels[PanelType.Console].size} minSize={currentLayout.panels[PanelType.Console].minSize} className="p-2" onResize={(size) => handlePanelResize(PanelType.Console, size)}>
                        <Card className="h-full py-0 overflow-hidden">
                          <EnhancedConsole />
                        </Card>
                      </ResizablePanel>
                    </>
                  )}
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default EnhancedPlayground;
