import { json, redirect } from '@remix-run/node';
import type { LinksFunction } from "@remix-run/node"; 
import {
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { getStoredNotes, storeNotes } from '~/data/notes';
import NewNote, { links as newNoteLinks } from '../components/NewNote'
import NoteList, { links as noteListLinks } from '~/components/NoteList';

export default function NotesPage() {  
  return (
    <main id="content">
      <NewNote />
      <NoteList />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();

  if (!notes || notes.length === 0) {
    throw json('No notes found', { status: 404, statusText: 'Not Found' });
  }

  return notes;
}

export async function action({ request }) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);

  if (noteData.title.trim().length < 5 || noteData.content.trim().length < 10) {
    return { message: 'Title must be at least 5 characters long and content must be at least 10 characters long', status: 400 }
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = [...existingNotes, noteData];
  await storeNotes(updatedNotes);
  await new Promise(resolve => setTimeout(resolve, 2000));
  return redirect('/notes');
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <NewNote />
        <p className="info-message">{error.data || 'Sorry, we couldn\'t process your request. Please try again later.'}</p>
      </main>
    );
  }

  const errorMessage = "Unknown error";

  return (
    <main className="error">
      <h1>Uh oh ...</h1>
      <p>Something went wrong.</p>
      <pre>{errorMessage}</pre>
    </main>
  );
}

export const links: LinksFunction = () => [
  ...newNoteLinks(),
  ...noteListLinks()
];
