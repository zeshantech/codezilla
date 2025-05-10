"use client";

import { Play, Save, RotateCcw, Settings, Code2, FileCode, Loader2, Download, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ProgrammingLanguageEnum } from "@/types";

interface EditorToolbarProps {
  language: ProgrammingLanguageEnum;
  onLanguageChange: (language: ProgrammingLanguageEnum) => void;
  onRun: () => void;
  onSave: () => void;
  onReset: () => void;
  onFormat: () => void;
  onAiAssist?: () => void;
  isRunning: boolean;
  isSaving: boolean;
  showAiAssist?: boolean;
}

export function EditorToolbar({ language, onLanguageChange, onRun, onSave, onReset, onFormat, onAiAssist, isRunning, isSaving, showAiAssist = false }: EditorToolbarProps) {
  const handleLanguageChange = (value: string) => {
    onLanguageChange(value as ProgrammingLanguageEnum);
  };

  const handleCopyCode = () => {
    // This would normally access the editor's code, but we'll mock it for now
    alert("Code copied to clipboard!");
  };

  const handleDownloadCode = () => {
    // This would normally download the editor's code, but we'll mock it for now
    alert("Code downloaded!");
  };

  return (
    <div className="flex items-center justify-between p-2 border-b bg-muted/20">
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Select value={language} onValueChange={handleLanguageChange}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className="w-36">
                  <div className="flex items-center">
                    <Code2 className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select language" />
                  </div>
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent>Select programming language</TooltipContent>
            </Tooltip>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-6" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onRun} disabled={isRunning}>
                {isRunning ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Play className="h-4 w-4 text-green-500" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Run code</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save code</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset code</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onFormat}>
                <FileCode className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Format code</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {showAiAssist && onAiAssist && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onAiAssist}>
                  <Sparkles className="h-4 w-4 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI Assistant</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy code</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleDownloadCode}>
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download code</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editor settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default EditorToolbar;
