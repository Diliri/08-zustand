import axios from 'axios';
import type { Note, NoteTag } from '@/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common.Authorization = `Bearer ${TOKEN}`;

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search = '', tag } = params;

  // Бекенд не очікує тег "all" — якщо обрано "All notes", параметр
  // tag взагалі не передається, і сервер повертає всі нотатки.
  const shouldFilterByTag = Boolean(tag) && tag !== 'all';

  const response = await axios.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search.trim() !== '' && { search: search.trim() }),
      ...(shouldFilterByTag && { tag }),
    },
  });

  return response.data;
};

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export const createNote = async (
  payload: CreateNotePayload
): Promise<Note> => {
  const response = await axios.post<Note>('/notes', payload);
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${noteId}`);
  return response.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const response = await axios.get<Note>(`/notes/${noteId}`);
  return response.data;
};