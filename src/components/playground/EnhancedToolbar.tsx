import { Button } from "@/components/ui/button";
import { Play, Wand2, Share2, Sun, Moon } from "lucide-react";
import { ProblemSelector } from "./ProblemSelector";
import { LayoutSelector } from "./LayoutSelector";
import { useTheme } from "next-themes";
import { PanelType } from "@/hooks/useEditorLayout";
import { useEditorLayoutContext } from "@/providers/EditorLayoutProvider";

interface EnhancedToolbarProps {
  problemSlug?: string;
  isRunning: boolean;
  onRun: () => void;
  onAiAssist?: () => void;
  onShare?: () => void;
}

export function EnhancedToolbar({
  problemSlug,
  isRunning,
  onRun,
  onAiAssist,
  onShare,
}: EnhancedToolbarProps) {
  const { theme, setTheme } = useTheme();
  const { togglePanelVisibility, currentLayout } = useEditorLayoutContext();

  const handleAiToggle = () => {
    // Simply toggle AI Help panel visibility based on current state
    // This preserves the user's preference for floating or docked
    if (onAiAssist) {
      onAiAssist();
    } else {
      togglePanelVisibility(PanelType.AiHelp);
    }
  };

  return (
    <div className="flex items-center justify-between p-1 px-2 bg-background border-b">
      <ProblemSelector currentProblemSlug={problemSlug} />

      <Button variant="default" size="sm" onClick={onRun} loading={isRunning}>
        <Play className="mr-2 h-4 w-4" />
        Run
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAiToggle}
          className={
            currentLayout.panels[PanelType.AiHelp].visible
              ? "bg-primary/10"
              : ""
          }
        >
          <Wand2 className="mr-2 h-4 w-4" />
          AI Assist
        </Button>

        <LayoutSelector />

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onShare}
          title="Share code"
        >
          <Share2 />
        </Button>
      </div>
    </div>
  );
}

export default EnhancedToolbar;
