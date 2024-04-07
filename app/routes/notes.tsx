import { redirect } from '@remix-run/node';
import { getStoredNotes, storeNotes } from '~/data/notes';
import NewNote from '../components/NewNote'
import NoteList from '~/components/NoteList';
import { useLoaderData } from '@remix-run/react';

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
  return redirect('/notes')
}
