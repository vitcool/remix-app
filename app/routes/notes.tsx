import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { LinksFunction } from "@remix-run/node"; 

import { getStoredNotes, storeNotes } from '~/data/notes';
import NewNote, { links as newNoteLinks } from '../components/NewNote'
import NoteList, { links as noteListLinks } from '~/components/NoteList';

export default function NotesPage() {
  const notes = useLoaderData();
  
  return (
    <main id="content">
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  return notes; // json(notes); // new Response(JSON.stringify(notes), { headers: { 'Content-Type': 'application/json' }});
}

export async function action({ request }) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  // add validation
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
