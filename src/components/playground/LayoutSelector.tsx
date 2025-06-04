import React from "react";
import { LayoutPreset } from "@/hooks/useEditorLayout";
import { useEditorLayoutContext } from "@/providers/EditorLayoutProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutGrid,
  Code,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export function LayoutSelector() {
  const {
    currentLayoutName,
    applyLayout,
    resetLayout,
  } = useEditorLayoutContext();

  // Get human-readable names for layout presets
  const getLayoutName = (preset: LayoutPreset) => {
    switch (preset) {
      case LayoutPreset.Default:
        return "Default";
      case LayoutPreset.Focus:
        return "Focus Mode";
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
      case LayoutPreset.Focus:
        return <Code className="mr-2 h-4 w-4" />;
      case LayoutPreset.Custom:
        return <LayoutGrid className="mr-2 h-4 w-4" />;
      default:
        return <LayoutGrid className="mr-2 h-4 w-4" />;
    }
  };

  const handleSwitchLayout = (preset: LayoutPreset) => {
    applyLayout(preset);
    toast.success(`Switched to ${getLayoutName(preset)} layout`);
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
        <DropdownMenuItem onClick={handleResetLayout}>
          <RefreshCw className="mr-2 h-4 w-4" />
          <span>Reset Layout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LayoutSelector;
