import { Button } from "@/components/ui/button";
import { Play, Wand2, Share2, Sun, Moon, TestTube2, UploadCloud } from "lucide-react";
import { ProblemSelector } from "./ProblemSelector";
import { LayoutSelector } from "./LayoutSelector";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { ButtonGroup } from "../ui/button-group";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";

export function EnhancedToolbar() {
  const { slug } = useParams();
  const { theme, setTheme } = useTheme();
  const isExecutingCode = useCodeEditorStore((state) => state.isExecutingCode);
  const isRunningTestCases = useCodeEditorStore((state) => state.isRunningTestCases);
  const executeCode = useCodeEditorStore((state) => state.executeCode);
  const runTestCases = useCodeEditorStore((state) => state.runTestCases);
  const submitCode = useCodeEditorStore((state) => state.submitCode);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(`${window.location.origin}/playground/${slug}?shared=true`);
    toast.success("Link copied to clipboard");
  }, [slug]);

  return (
    <div className="flex items-center justify-between p-1 px-2 bg-background border-b">
      <ProblemSelector />

      <ButtonGroup size={"sm"} variant={"outline"}>
        <Button onClick={executeCode} loading={isExecutingCode}>
          <Play />
          Run Code
        </Button>

        <Button onClick={() => runTestCases(["1", "2"])} loading={isRunningTestCases}>
          <TestTube2 />
          Run Tests
        </Button>

        <Button onClick={submitCode} loading={isRunningTestCases} className="!bg-success-background text-success">
          <UploadCloud />
          Submit
        </Button>
      </ButtonGroup>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon-sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>

        <Button variant="outline" size="sm">
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
