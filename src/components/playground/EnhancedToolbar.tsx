import { Button } from "@/components/ui/button";
import { Play, Wand2, Share2, Sun, Moon, CheckSquare, ChevronDown } from "lucide-react";
import { ProblemSelector } from "./ProblemSelector";
import { LayoutSelector } from "./LayoutSelector";
import { useTheme } from "next-themes";
import { PanelType } from "@/hooks/useEditorLayout";
import { useEditorLayoutContext } from "@/providers/EditorLayoutProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCallback } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

interface EnhancedToolbarProps {
  isRunning: boolean;
  onRun: () => void;
  onRunTests?: (testIds?: number[]) => void;
}

export function EnhancedToolbar({ isRunning, onRun, onRunTests }: EnhancedToolbarProps) {
  const { slug } = useParams();
  const { theme, setTheme } = useTheme();
  const { togglePanelVisibility, currentLayout } = useEditorLayoutContext();

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(`${window.location.origin}/playground/${slug}?shared=true`);
    toast.success("Link copied to clipboard");
  }, [slug]);

  const handleAiToggle = () => {
    togglePanelVisibility(PanelType.AiHelp);
  };

  return (
    <div className="flex items-center justify-between p-1 px-2 bg-background border-b">
      <ProblemSelector />

      <div className="flex items-center gap-2">
        <Button variant="default" size="sm" onClick={onRun} loading={isRunning}>
          <Play />
          Run
        </Button>

        {onRunTests && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <CheckSquare />
                Run Tests
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onRunTests()}>Run All Tests</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRunTests([0, 1])}>Run First 2 Tests</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRunTests([0])}>Run Test #1</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRunTests([1])}>Run Test #2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon-sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>

        <Button variant="outline" size="sm" onClick={handleAiToggle} className={currentLayout.panels[PanelType.AiHelp].visible ? "bg-primary/10" : ""}>
          <Wand2 />
          AI Assist
        </Button>

        <LayoutSelector />

        <Button variant="ghost" size="icon-sm" onClick={handleShare} title="Share code">
          <Share2 />
        </Button>
      </div>
    </div>
  );
}

export default EnhancedToolbar;
