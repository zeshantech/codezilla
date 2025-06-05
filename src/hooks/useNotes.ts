"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { INoteUpdateInput } from "@/types";
import * as notesAPI from "@/lib/api/notes";

export function useNotes(problemId: string) {
  const queryClient = useQueryClient();

  const useAllNotes = () => {
    return useQuery({
      queryKey: ["notes", problemId],
      queryFn: async () => {
        const notes = await notesAPI.fetchNotes(problemId!);

        return notes;
      },
      enabled: !!problemId,
      staleTime: 1000 * 60 * 5,
    });
  };

  const useCreateNote = () => {
    return useMutation({
      mutationFn: async (content: string) => {
        const note = await notesAPI.createNote({
          content,
          problemId,
        });
        return note;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notes", problemId] });
        toast.success("Problem created successfully!");
      },
      onError: (error: unknown) => {
        toast.error("Failed to create problem");
        console.error("Error creating problem:", error);
      },
    });
  };

  const useUpdateNote = () => {
    return useMutation({
      mutationFn: async (input: INoteUpdateInput) => {
        const note = await notesAPI.updateNote(input);
        return note;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notes", problemId] });
        toast.success("Note updated successfully");
      },
      onError: (error: unknown) => {
        toast.error("Failed to update note");
        console.error("Error updating note:", error);
      },
    });
  };

  const useDeleteNote = () => {
    return useMutation({
      mutationFn: async (noteId: string) => {
        await notesAPI.deleteNote(noteId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notes", problemId] });
        toast.success("Note updated successfully");
      },
      onError: (error: unknown) => {
        toast.error("Failed to update note");
        console.error("Error updating note:", error);
      },
    });
  };

  const useClearNotes = () => {
    return useMutation({
      mutationFn: () => notesAPI.clearNotes(problemId),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["notes", problemId] });
        toast.success(`${data.deletedCount} notes cleared successfully`);
      },
      onError: (error: unknown) => {
        toast.error("Failed to clear notes");
        console.error("Error clearing notes:", error);
      },
    });
  };

  const allNotesQuery = useAllNotes();
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();
  const clearNotesMutation = useClearNotes();

  const createNote = useCallback(
    (content: string) => {
      return createNoteMutation.mutateAsync(content);
    },
    [createNoteMutation]
  );

  const updateNote = useCallback(
    (input: INoteUpdateInput) => {
      return updateNoteMutation.mutateAsync(input);
    },
    [updateNoteMutation]
  );

  const deleteNote = useCallback(
    (noteId: string) => {
      return deleteNoteMutation.mutateAsync(noteId);
    },
    [deleteNoteMutation]
  );

  const clearNotes = useCallback(() => {
    return clearNotesMutation.mutateAsync();
  }, [clearNotesMutation]);

  return {
    useAllNotes,
    allNotes: allNotesQuery.data,
    allNotesError: allNotesQuery.error,
    isAllNotesLoading: allNotesQuery.isLoading,
    isAllNotesError: allNotesQuery.error,
    isAllNotesSuccess: allNotesQuery.isSuccess,

    useCreateNote,
    createNote,
    isCreateNoteError: createNoteMutation.isError,
    isCreateNotePending: createNoteMutation.isPending,
    isCreateNoteSuccess: createNoteMutation.isSuccess,

    useUpdateNote,
    updateNote,
    isUpdateNoteError: updateNoteMutation.isError,
    isUpdateNotePending: updateNoteMutation.isPending,
    isUpdateNoteSuccess: updateNoteMutation.isSuccess,

    useDeleteNote,
    deleteNote,
    isDeleteNoteError: deleteNoteMutation.isError,
    isDeleteNotePending: deleteNoteMutation.isPending,
    isDeleteNoteSuccess: deleteNoteMutation.isSuccess,

    useClearNotes,
    clearNotes,
    isClearNotesError: clearNotesMutation.isError,
    isClearNotesPending: clearNotesMutation.isPending,
    isClearNotesSuccess: clearNotesMutation.isSuccess,
  };
}

export default useNotes;
