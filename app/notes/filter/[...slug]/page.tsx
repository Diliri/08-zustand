import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import Notes from './Notes.client';

interface FilterNotesPageProps {
  params: Promise<{ slug?: string[] }>;
}

const PER_PAGE = 12;

export default async function FilterNotesPage({
  params,
}: FilterNotesPageProps) {
  const { slug } = await params;

  // slug === ['all'] -> без фільтрації, slug === ['Work'] -> фільтр за тегом
  const rawTag = slug?.[0];
  const tag = rawTag && rawTag !== 'all' ? rawTag : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag ?? 'all'],
    queryFn: () => fetchNotes({ page: 1, perPage: PER_PAGE, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={tag} />
    </HydrationBoundary>
  );
}