"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save } from "lucide-react";

interface NotesEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
  isEditing?: boolean;
  placeholder?: string;
  isLoading?: boolean;
}

export function NotesEditor({
  initialContent = "",
  onSave,
  isEditing = false,
  placeholder = "Add a new note...",
  isLoading = false,
}: NotesEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSave = () => {
    if (content.trim()) {
      onSave(content.trim());
      if (!isEditing) {
        setContent(""); // Clear after adding, but not after editing
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Ctrl+Enter or Cmd+Enter
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="border rounded-md">
      <div className="p-2">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[100px] resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div className="flex justify-end border-t p-2">
        <Button
          onClick={handleSave}
          disabled={!content.trim() || isLoading}
          size="sm"
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              {isEditing ? "Updating..." : "Adding..."}
            </span>
          ) : isEditing ? (
            <>
              <Save className="w-4 h-4 mr-1" />
              Update
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" />
              Add Note
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default NotesEditor;
