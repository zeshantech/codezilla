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
  MessageSquare,
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
import { Spinner, SpinnerBox } from "../ui/spinner";
import { Editor } from "../blocks/editor-00/editor";
import { NotesEditor } from "./NotesEditor";
import { EmptyState } from "../ui/emptyState";
import dayjs from "dayjs";

interface NotesPanelProps {
  problemId: string;
}

export function NotesPanel({ problemId }: NotesPanelProps) {
  const {
    allNotes,
    isAllNotesLoading,
    createNote,
    updateNote,
    deleteNote,
    clearNotes,
    isCreateNotePending,
    isUpdateNotePending,
    isDeleteNotePending,
    isClearNotesPending,
  } = useNotes(problemId);

  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingNote && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editingNote]);

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      createNote(newNoteContent.trim());
      setNewNoteContent("");
    }
  };

  const handleSaveEdit = () => {
    if (editingNote && editingNote.content.trim()) {
      updateNote({
        noteId: editingNote.id,
        content: editingNote.content.trim(),
      });
      setEditingNote(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  const handleEditNote = (id: string, content: string) => {
    setEditingNote({ id, content });
  };

  const handleKeyDown = (e: React.KeyboardEvent, isEditing = false) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (isEditing) {
        handleSaveEdit();
      } else {
        handleAddNote();
      }
    }

    if (e.key === "Escape" && isEditing) {
      handleCancelEdit();
    }
  };

  if (isAllNotesLoading) {
    return <SpinnerBox />;
  }

  return (
    <div className="flex flex-col h-full space-y-2">
      <div className="flex items-center justify-between">
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

      <Separator />

      {/* Notes list */}
      <ScrollArea className="flex-1">
        {!allNotes?.length ? (
          // <div className="h-24 flex items-center justify-center text-muted-foreground text-center p-4">
          //   <div>
          //     <p className="mb-1">No notes yet</p>
          //     <p className="text-xs">
          //       Add a note below to keep track of your thoughts
          //     </p>
          //   </div>
          // </div>

          <EmptyState
            title="No notes yet"
            description="Add a note below to keep track of your thoughts"
            icon={<MessageSquare />}
          />
        ) : (
          <div className="space-y-3">
            {allNotes.map((note) => (
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
                      value={editingNote?.content}
                      onChange={(e) =>
                        setEditingNote({
                          id: editingNote?.id ?? "",
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
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        loading={isUpdateNotePending}
                      >
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
                      {note.updatedAt && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {dayjs(note.updatedAt).format("MMM D, h:mm A")}
                        </div>
                      )}
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
                          loading={isDeleteNotePending}
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

      <div className="mt-auto">
        <Textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new note... (Ctrl+Enter to save)"
          className="mb-2 min-h-[80px] resize-none"
        />
        <Button
          onClick={handleAddNote}
          size="sm"
          className="w-full"
          disabled={!newNoteContent.trim()}
          loading={isCreateNotePending}
        >
          <Plus />
          Add Note
        </Button>
      </div>

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
              disabled={isClearNotesPending}
              onClick={() => clearNotes()}
              className="bg-error"
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
