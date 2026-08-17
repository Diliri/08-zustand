'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import css from './NotesPage.module.css';

interface NotesProps {
  tag?: string;
}

const PER_PAGE = 12;
const DEBOUNCE_DELAY = 500;

export default function Notes({ tag }: NotesProps) {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');

  // Сбрасываем страницу на первую при смене тега в сайдбаре.
  // Паттерн "adjust state during render" вместо useEffect+setState,
  // чтобы не провоцировать лишний каскадный ре-рендер.
  const [prevTag, setPrevTag] = useState<string | undefined>(tag);
  if (tag !== prevTag) {
    setPrevTag(tag);
    setPage(1);
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search, tag ?? 'all'],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search, tag }),
    placeholderData: keepPreviousData,
  });

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value);
  }, DEBOUNCE_DELAY);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSetSearch(value);
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && notes.length > 0 && (
        <NoteList notes={notes} />
      )}
    </div>
  );
}