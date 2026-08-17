import type { Metadata } from 'next';
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
const OG_IMAGE = {
  url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
  width: 1200,
  height: 630,
  alt: 'NoteHub application preview',
};

function resolveTag(slug: string[] | undefined): string | undefined {
  const rawTag = slug?.[0];
  return rawTag && rawTag !== 'all' ? rawTag : undefined;
}

export async function generateMetadata({
  params,
}: FilterNotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = resolveTag(slug);

  const title = tag ? `${tag} notes | NoteHub` : 'All notes | NoteHub';
  const description = tag
    ? `Browse your notes filtered by the "${tag}" tag on NoteHub.`
    : 'Browse and manage all of your notes on NoteHub.';
  const url = `https://notehub.com/notes/filter/${tag ?? 'all'}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [OG_IMAGE],
    },
  };
}

export default async function FilterNotesPage({
  params,
}: FilterNotesPageProps) {
  const { slug } = await params;
  const tag = resolveTag(slug);

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