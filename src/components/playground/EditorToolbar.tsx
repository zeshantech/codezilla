import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code, Save, Undo2, FileCode, DownloadCloud } from "lucide-react";
import { SettingsDialog } from "./SettingsDialog";
import { ProgrammingLanguageEnum } from "@/types";
import SubmissionHistoryDrawer from "./SubmissionHistoryDrawer";
import { useCodeEditorContext } from "@/contexts/CodeEditorContext";
import { noop } from "@/lib/utils";

export default function EditorToolbar() {
  const { changeLanguage, language, saveCode, isDirty, resetCode, formatCode } = useCodeEditorContext();

  const handleLanguageChange = (value: string) => {
    changeLanguage(value as ProgrammingLanguageEnum);
  };

  return (
    <div className="flex items-center p-1 gap-1">
      {/* Language selector */}
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger size="sm">
          <Code />
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="javascript">JavaScript</SelectItem>
          <SelectItem value="python">Python</SelectItem>
          <SelectItem value="java">Java</SelectItem>
          <SelectItem value="cpp">C++</SelectItem>
        </SelectContent>
      </Select>

      <div className="ml-auto" />
      <SubmissionHistoryDrawer />

      {/* Save button */}
      <Button variant="outline" size="sm" onClick={saveCode} disabled={!isDirty}>
        <Save />
        Save
      </Button>

      {/* Reset button */}
      <Button variant="outline" size="sm" onClick={resetCode}>
        <Undo2 />
        Reset
      </Button>

      {/* Format button */}
      <Button variant="outline" size="sm" onClick={formatCode}>
        <FileCode />
        Format
      </Button>

      {/* Download button */}
      <Button variant="outline" size="icon-sm" onClick={noop}>
        <DownloadCloud />
      </Button>

      {/* Settings dialog */}
      <SettingsDialog />
    </div>
  );
}
