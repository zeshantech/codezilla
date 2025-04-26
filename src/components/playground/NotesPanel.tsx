import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Trash2,
  Save,
  MoreVertical,
  FileEdit,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNotes } from "@/hooks/useNotes";
import { Spinner } from "../ui/spinner";

interface NotesPanelProps {
  problemId: string;
}

export function NotesPanel({ problemId }: NotesPanelProps) {
  const { notes, isLoading, addNote, updateNote, deleteNote, clearNotes } =
    useNotes(problemId);

  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the textarea when editing a note
  useEffect(() => {
    if (editingNote && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editingNote]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Handle adding a new note
  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      addNote(newNoteContent.trim());
      setNewNoteContent("");
    }
  };

  // Handle saving an edited note
  const handleSaveEdit = () => {
    if (editingNote && editingNote.content.trim()) {
      updateNote(editingNote.id, editingNote.content.trim());
      setEditingNote(null);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  // Start editing a note
  const handleEditNote = (id: string, content: string) => {
    setEditingNote({ id, content });
  };

  // Handle key presses in the textarea
  const handleKeyDown = (e: React.KeyboardEvent, isEditing = false) => {
    // Save note on Ctrl+Enter
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (isEditing) {
        handleSaveEdit();
      } else {
        handleAddNote();
      }
    }

    // Cancel on Escape
    if (e.key === "Escape" && isEditing) {
      handleCancelEdit();
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">My Notes</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setIsConfirmOpen(true)}
              className="text-error"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Notes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator className="mb-3" />

      {/* Notes list */}
      <ScrollArea className="flex-1 mb-3">
        {notes.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-muted-foreground text-center p-4">
            <div>
              <p className="mb-1">No notes yet</p>
              <p className="text-xs">
                Add a note below to keep track of your thoughts
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`border rounded-md p-3 ${
                  editingNote?.id === note.id
                    ? "border-primary"
                    : "border-border"
                }`}
              >
                {editingNote?.id === note.id ? (
                  <div>
                    <Textarea
                      ref={textareaRef}
                      value={editingNote.content}
                      onChange={(e) =>
                        setEditingNote({
                          ...editingNote,
                          content: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, true)}
                      className="min-h-[100px] mb-2"
                      placeholder="Enter your note..."
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveEdit}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="whitespace-pre-wrap mb-2 text-sm">
                      {note.content}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(note.updatedAt)}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleEditNote(note.id, note.content)}
                        >
                          <FileEdit />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Add new note */}
      <div className="mt-auto">
        <Textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new note... (Ctrl+Enter to save)"
          className="mb-2 min-h-[80px]"
        />
        <Button
          onClick={handleAddNote}
          size="sm"
          className="w-full"
          disabled={!newNoteContent.trim()}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      {/* Confirmation dialog for clearing all notes */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all notes?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All notes for this problem will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearNotes}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default NotesPanel;
