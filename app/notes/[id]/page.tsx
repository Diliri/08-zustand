import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetails from './NoteDetails.client';

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

const OG_IMAGE = {
  url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
  width: 1200,
  height: 630,
  alt: 'NoteHub application preview',
};

function buildDescription(content: string): string {
  const trimmed = content.trim();
  return trimmed.length > 150 ? `${trimmed.slice(0, 150)}...` : trimmed;
}

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    const title = `${note.title} | NoteHub`;
    const description = buildDescription(note.content);
    const url = `https://notehub.com/notes/${id}`;

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
  } catch {
    return {
      title: 'Note | NoteHub',
      description: 'View note details on NoteHub.',
    };
  }
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetails />
    </HydrationBoundary>
  );
}