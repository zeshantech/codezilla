"use client";

import { useState, useCallback, useEffect } from "react";

interface Note {
  id: string;
  problemId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function useNotes(problemId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load notes for the current problem from localStorage
  useEffect(() => {
    try {
      setIsLoading(true);
      const savedNotes = localStorage.getItem(`notes-${problemId}`);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [problemId]);

  // Save notes to localStorage
  const saveNotesToStorage = useCallback(
    (updatedNotes: Note[]) => {
      try {
        localStorage.setItem(
          `notes-${problemId}`,
          JSON.stringify(updatedNotes)
        );
      } catch (error) {
        console.error("Failed to save notes:", error);
      }
    },
    [problemId]
  );

  // Add a new note
  const addNote = useCallback(
    (content: string) => {
      const newNote: Note = {
        id: Date.now().toString(),
        problemId,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      return newNote;
    },
    [notes, problemId, saveNotesToStorage]
  );

  // Update an existing note
  const updateNote = useCallback(
    (id: string, content: string) => {
      const updatedNotes = notes.map((note) =>
        note.id === id
          ? {
              ...note,
              content,
              updatedAt: new Date().toISOString(),
            }
          : note
      );

      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
    },
    [notes, saveNotesToStorage]
  );

  // Delete a note
  const deleteNote = useCallback(
    (id: string) => {
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
    },
    [notes, saveNotesToStorage]
  );

  // Clear all notes for this problem
  const clearNotes = useCallback(() => {
    setNotes([]);
    saveNotesToStorage([]);
  }, [saveNotesToStorage]);

  return {
    notes,
    isLoading,
    addNote,
    updateNote,
    deleteNote,
    clearNotes,
  };
}

export default useNotes;
