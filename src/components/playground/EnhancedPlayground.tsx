import { useEffect } from "react";
import { useAiAssistant } from "@/hooks/useAiAssistant";
import { PanelType } from "@/hooks/useEditorLayout";
import { useEditorLayoutContext } from "@/providers/EditorLayoutProvider";
import { EnhancedCodeEditor } from "./EnhancedCodeEditor";
import { EnhancedConsole } from "./EnhancedConsole";
import { NotesPanel } from "./NotesPanel";
import { AiHelpPanel } from "./AiHelpPanel";
import { FloatingPanel } from "./FloatingPanel";
import { ProblemDetail } from "@/components/problems/ProblemDetail";
import EnhancedToolbar from "./EnhancedToolbar";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Card } from "@/components/ui/card";
import { useCodeEditorContext } from "@/contexts/CodeEditorContext";

export function EnhancedPlayground() {
  const { problem } = useCodeEditorContext();
  const { initializeChat } = useAiAssistant(problem);
  const { currentLayout, updatePanelPosition, togglePanelVisibility } = useEditorLayoutContext();

  useEffect(() => {
    if (problem) {
      initializeChat();
    }
  }, [problem, initializeChat]);

  const handlePositionChange = (panelType: PanelType, x: number, y: number) => {
    updatePanelPosition(panelType, x, y);
  };

  return (
    <div className="flex h-screen flex-col">
      <EnhancedToolbar />

      <div className="flex-1 relative overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {(currentLayout.panels[PanelType.Problem].visible || (currentLayout.panels[PanelType.Notes].visible && !currentLayout.panels[PanelType.Notes].isFloating)) && (
            <>
              <ResizablePanel defaultSize={40} minSize={30} className={!currentLayout.panels[PanelType.Problem].visible && (!currentLayout.panels[PanelType.Notes].visible || currentLayout.panels[PanelType.Notes].isFloating) ? "hidden" : ""}>
                <ResizablePanelGroup direction="vertical">
                  {currentLayout.panels[PanelType.Problem].visible && (
                    <>
                      <ResizablePanel defaultSize={currentLayout.panels[PanelType.Problem].size} minSize={currentLayout.panels[PanelType.Problem].minSize} className="p-2">
                        <Card className="h-full py-0 overflow-hidden">
                          <ProblemDetail />
                        </Card>
                      </ResizablePanel>
                      {currentLayout.panels[PanelType.Notes].visible && !currentLayout.panels[PanelType.Notes].isFloating && <ResizableHandle />}
                    </>
                  )}

                  {currentLayout.panels[PanelType.Notes].visible && !currentLayout.panels[PanelType.Notes].isFloating && (
                    <ResizablePanel defaultSize={currentLayout.panels[PanelType.Notes].size} minSize={currentLayout.panels[PanelType.Notes].minSize} className="p-2">
                      <Card className="h-full py-0 overflow-hidden">
                        <NotesPanel problemId={problem?.id || "draft"} />
                      </Card>
                    </ResizablePanel>
                  )}
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          <ResizablePanel defaultSize={60} minSize={40}>
            <ResizablePanelGroup direction="vertical">
              {currentLayout.panels[PanelType.Editor].visible && (
                <>
                  <ResizablePanel defaultSize={currentLayout.panels[PanelType.Editor].size} minSize={currentLayout.panels[PanelType.Editor].minSize} className="p-2">
                    <Card className="h-full py-0 overflow-hidden relative">
                      <EnhancedCodeEditor autoFocus />
                    </Card>
                  </ResizablePanel>

                  {(currentLayout.panels[PanelType.Console].visible || (currentLayout.panels[PanelType.AiHelp].visible && !currentLayout.panels[PanelType.AiHelp].isFloating)) && <ResizableHandle />}
                </>
              )}

              {(currentLayout.panels[PanelType.Console].visible || (currentLayout.panels[PanelType.AiHelp].visible && !currentLayout.panels[PanelType.AiHelp].isFloating)) && (
                <ResizablePanel defaultSize={40} minSize={20}>
                  <ResizablePanelGroup direction="horizontal">
                    {currentLayout.panels[PanelType.Console].visible && (
                      <ResizablePanel defaultSize={50} minSize={20} className="p-2">
                        <Card className="h-full py-0 overflow-hidden">
                          <EnhancedConsole />
                        </Card>
                      </ResizablePanel>
                    )}

                    {currentLayout.panels[PanelType.Console].visible && currentLayout.panels[PanelType.AiHelp].visible && !currentLayout.panels[PanelType.AiHelp].isFloating && <ResizableHandle />}

                    {currentLayout.panels[PanelType.AiHelp].visible && !currentLayout.panels[PanelType.AiHelp].isFloating && (
                      <ResizablePanel defaultSize={50} minSize={20} className="p-2">
                        <Card className="h-full py-0 overflow-hidden">
                          <AiHelpPanel />
                        </Card>
                      </ResizablePanel>
                    )}
                  </ResizablePanelGroup>
                </ResizablePanel>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>

        {currentLayout.panels[PanelType.AiHelp].visible && currentLayout.panels[PanelType.AiHelp].isFloating && (
          <FloatingPanel
            title="AI Help"
            initialPosition={
              currentLayout.panels[PanelType.AiHelp].position || {
                x: 20,
                y: 80,
              }
            }
            width={500}
            height={400}
            onClose={() => togglePanelVisibility(PanelType.AiHelp)}
            onPositionChange={(x, y) => handlePositionChange(PanelType.AiHelp, x, y)}
            className="bg-card"
          >
            <AiHelpPanel />
          </FloatingPanel>
        )}

        {currentLayout.panels[PanelType.Notes].visible && currentLayout.panels[PanelType.Notes].isFloating && (
          <FloatingPanel
            title="Notes"
            initialPosition={
              currentLayout.panels[PanelType.Notes].position || {
                x: 20,
                y: 200,
              }
            }
            width={450}
            height={500}
            onClose={() => togglePanelVisibility(PanelType.Notes)}
            onPositionChange={(x, y) => handlePositionChange(PanelType.Notes, x, y)}
            className="bg-card"
          >
            <NotesPanel problemId={problem?.id || "draft"} />
          </FloatingPanel>
        )}
      </div>
    </div>
  );
}

export default EnhancedPlayground;
