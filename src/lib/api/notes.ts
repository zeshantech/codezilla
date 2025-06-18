import api from "./api";
import { INote, INoteCreateInput, INoteUpdateInput } from "@/types/notes";

export async function fetchNotes(problemId: string): Promise<INote[]> {
  const response = await api.get(`/notes/problem/${problemId}`);

  return response.data;
}

export async function createNote(input: INoteCreateInput): Promise<INote> {
  const response = await api.post(`/notes`, input);

  return response.data;
}

export async function updateNote(input: INoteUpdateInput): Promise<INote> {
  const response = await api.put(`/notes/${input.noteId}`, {
    content: input.content,
  });

  return response.data;
}

export async function deleteNote(noteId: string): Promise<void> {
  await api.delete(`/notes/${noteId}`);
}

export async function clearNotes(
  problemId: string
): Promise<{ deletedCount: number }> {
  const response = await api.delete(`/notes/problem/${problemId}`);

  return response.data;
}
