'use client';

interface FilterNotesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function FilterNotesError({ error }: FilterNotesErrorProps) {
  return <p>Could not fetch the list of notes. {error.message}</p>;
}