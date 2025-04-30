"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IProblem } from "@/types";
import { CodeEditor } from "./CodeEditor";
import { EditorToolbar } from "./EditorToolbar";
import { CodeOutput } from "./CodeOutput";
import { useCodeEditor } from "@/hooks/useCodeEditor";

interface EditorPanelProps {
  problem?: IProblem | null;
  initialHeight?: string;
  showAiAssist?: boolean;
}

export function EditorPanel({ problem, initialHeight = "600px", showAiAssist = false }: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("editor");

  const { code, language, isSaving, executionResult, isExecuting, updateCode, changeLanguage, runCode, resetCode, saveCode, formatCode } = useCodeEditor({
    problem,
    initialLanguage: "javascript",
  });

  // Toggle between editor and output tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // AI assist feature (mock implementation)
  const handleAiAssist = () => {
    alert("AI Assistant: How can I help you with your code?");
  };

  return (
    <div className="border rounded-md overflow-hidden flex flex-col" style={{ height: initialHeight }}>
      <EditorToolbar language={language} onLanguageChange={changeLanguage} onRun={runCode} onSave={saveCode} onReset={resetCode} onFormat={formatCode} onAiAssist={showAiAssist ? handleAiAssist : undefined} isRunning={isExecuting} isSaving={isSaving} showAiAssist={showAiAssist} />

      <div className="flex-grow flex flex-col">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col h-full">
          <TabsList className="w-full">
            <TabsTrigger value="editor" className="flex-1">
              Editor
            </TabsTrigger>
            <TabsTrigger value="output" className="flex-1">
              Output
              {executionResult && <span className={`ml-2 size-2 rounded-full ${executionResult.status === "success" ? "bg-success" : "bg-error"}`} />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-grow outline-none mt-0 p-0">
            <div className="h-full w-full">
              <CodeEditor code={code} language={language} onChange={updateCode} autoFocus />
            </div>
          </TabsContent>

          <TabsContent value="output" className="flex-grow outline-none mt-0 p-0">
            <CodeOutput result={executionResult} isExecuting={isExecuting} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default EditorPanel;
