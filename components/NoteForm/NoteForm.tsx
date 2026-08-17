'use client';

import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useNoteStore } from '@/lib/store/noteStore';
import type { NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

const TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes/filter/all');
    },
    onError: (error) => {
      console.error('Failed to create note:', error);
    },
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setDraft({ [name]: value });
  };

  const handleCreate = (formData: FormData) => {
    const title = String(formData.get('title') ?? '');
    const content = String(formData.get('content') ?? '');
    const tag = String(formData.get('tag') ?? 'Todo') as NoteTag;

    mutation.mutate({ title, content, tag });
  };

  const handleCancel = () => {
    // Чернетку НЕ очищаємо — користувач може повернутися пізніше.
    router.back();
  };

  return (
    <form className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
          minLength={3}
          maxLength={50}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          {TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {mutation.isError && (
        <span className={css.error}>
          Could not create the note. Check your token / connection and try
          again.
        </span>
      )}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          formAction={handleCreate}
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}