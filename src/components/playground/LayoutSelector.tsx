import React from "react";
import { LayoutPreset, PanelType } from "@/hooks/useEditorLayout";
import { useEditorLayoutContext } from "@/providers/EditorLayoutProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutGrid,
  Maximize,
  Minimize,
  CheckSquare,
  Square,
  Code,
  BookOpen,
  AlignJustify,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export function LayoutSelector() {
  const {
    currentLayoutName,
    applyLayout,
    resetLayout,
    togglePanelVisibility,
    togglePanelFloating,
    currentLayout,
  } = useEditorLayoutContext();

  // Get human-readable names for layout presets
  const getLayoutName = (preset: LayoutPreset) => {
    switch (preset) {
      case LayoutPreset.Default:
        return "Default";
      case LayoutPreset.Coding:
        return "Coding Focus";
      case LayoutPreset.Learning:
        return "Learning Mode";
      case LayoutPreset.Minimal:
        return "Minimal";
      case LayoutPreset.Custom:
        return "Custom";
      default:
        return preset;
    }
  };

  // Get icons for layout presets
  const getLayoutIcon = (preset: LayoutPreset) => {
    switch (preset) {
      case LayoutPreset.Default:
        return <LayoutGrid className="mr-2 h-4 w-4" />;
      case LayoutPreset.Coding:
        return <Code className="mr-2 h-4 w-4" />;
      case LayoutPreset.Learning:
        return <BookOpen className="mr-2 h-4 w-4" />;
      case LayoutPreset.Minimal:
        return <AlignJustify className="mr-2 h-4 w-4" />;
      case LayoutPreset.Custom:
        return <LayoutGrid className="mr-2 h-4 w-4" />;
      default:
        return <LayoutGrid className="mr-2 h-4 w-4" />;
    }
  };

  // Get panel names for display
  const getPanelName = (panel: PanelType) => {
    switch (panel) {
      case PanelType.Problem:
        return "Problem Description";
      case PanelType.Notes:
        return "Notes";
      case PanelType.Editor:
        return "Code Editor";
      case PanelType.Console:
        return "Console";
      case PanelType.AiHelp:
        return "AI Help";
      default:
        return panel;
    }
  };

  // Determine if a panel can be floated
  const canPanelFloat = (panel: PanelType) => {
    return panel === PanelType.AiHelp || panel === PanelType.Notes;
  };

  const handleSwitchLayout = (preset: LayoutPreset) => {
    applyLayout(preset);
    toast.success(`Switched to ${getLayoutName(preset)} layout`);
  };

  const handleTogglePanel = (panel: PanelType) => {
    togglePanelVisibility(panel);
    const action = currentLayout.panels[panel].visible ? "hidden" : "shown";
    toast.success(`${getPanelName(panel)} panel ${action}`);
  };

  const handleToggleFloating = (panel: PanelType) => {
    togglePanelFloating(panel);
    const mode = currentLayout.panels[panel].isFloating ? "docked" : "floating";
    toast.success(`${getPanelName(panel)} panel is now ${mode}`);
  };

  const handleResetLayout = () => {
    resetLayout();
    toast.success("Layout reset to default");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <LayoutGrid className="mr-2 h-4 w-4" />
          Layout
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Layout Presets</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {Object.values(LayoutPreset).map((preset) => (
            <DropdownMenuItem
              key={preset}
              onClick={() => handleSwitchLayout(preset)}
              className={
                currentLayoutName === preset ? "bg-muted font-medium" : ""
              }
            >
              {getLayoutIcon(preset)}
              <span>{getLayoutName(preset)}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Panels</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {Object.values(PanelType).map((panel) => (
            <DropdownMenuSub key={panel}>
              <DropdownMenuSubTrigger>
                {currentLayout.panels[panel].visible ? (
                  <CheckSquare className="mr-2 h-4 w-4" />
                ) : (
                  <Square className="mr-2 h-4 w-4" />
                )}
                <span>{getPanelName(panel)}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => handleTogglePanel(panel)}>
                    {currentLayout.panels[panel].visible ? (
                      <>
                        <Minimize className="mr-2 h-4 w-4" />
                        <span>Hide Panel</span>
                      </>
                    ) : (
                      <>
                        <Maximize className="mr-2 h-4 w-4" />
                        <span>Show Panel</span>
                      </>
                    )}
                  </DropdownMenuItem>

                  {canPanelFloat(panel) && (
                    <DropdownMenuItem
                      onClick={() => handleToggleFloating(panel)}
                    >
                      {currentLayout.panels[panel].isFloating ? (
                        <>
                          <LayoutGrid className="mr-2 h-4 w-4" />
                          <span>Dock Panel</span>
                        </>
                      ) : (
                        <>
                          <Maximize className="mr-2 h-4 w-4" />
                          <span>Float Panel</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleResetLayout}>
          <RefreshCw className="mr-2 h-4 w-4" />
          <span>Reset Layout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LayoutSelector;
