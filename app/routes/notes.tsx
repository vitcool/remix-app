import { json, redirect } from '@remix-run/node';
import type { LinksFunction } from "@remix-run/node"; 

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

export const links: LinksFunction = () => [
  ...newNoteLinks(),
  ...noteListLinks()
];
