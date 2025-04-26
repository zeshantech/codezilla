import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Code,
  Play,
  Save,
  Undo2,
  FileCode,
  Settings as SettingsIcon,
  DownloadCloud,
  Share2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ProblemSelector } from "./ProblemSelector";
import { SettingsDialog } from "./SettingsDialog";
import { ProgrammingLanguage } from "@/types";
import useEditorSettings, { EditorSettings } from "@/hooks/useEditorSettings";
import { toast } from "sonner";

interface EditorToolbarProps {
  language: ProgrammingLanguage;
  isSaving: boolean;
  hasChanges: boolean;
  onSave: () => void;
  onReset: () => void;
  onFormat: () => void;
  onDownload?: () => void;
  onChangeLanguage: (language: ProgrammingLanguage) => void;
}

export default function EditorToolbar({
  language,
  isSaving,
  hasChanges,
  onSave,
  onReset,
  onFormat,
  onDownload,
  onChangeLanguage,
}: EditorToolbarProps) {
  const handleLanguageChange = (value: string) => {
    onChangeLanguage(value as ProgrammingLanguage);
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
      {/* Save button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onSave}
        loading={isSaving}
        disabled={!hasChanges}
      >
        <Save />
        Save
      </Button>

      {/* Reset button */}
      <Button variant="outline" size="sm" onClick={onReset}>
        <Undo2 />
        Reset
      </Button>

      {/* Format button */}
      <Button variant="outline" size="sm" onClick={onFormat}>
        <FileCode />
        Format
      </Button>

      {/* Download button */}
      <Button variant="outline" size="icon-sm" onClick={onDownload}>
        <DownloadCloud />
      </Button>

      {/* Settings dialog */}
      <SettingsDialog />
    </div>
  );
}
