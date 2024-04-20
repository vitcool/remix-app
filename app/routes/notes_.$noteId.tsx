import { Link, json, useLoaderData } from "@remix-run/react";
import { getStoredNotes } from "~/data/notes";

import styles from '~/styles/note-details.css';

export default function NoteDetails () {
  const note = useLoaderData();

  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to Notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
  
      <p id="note-details-content">{note.content}</p>
    </main>
  )
}

export async function loader({ params: { noteId }}) {
  const notes = await getStoredNotes();

  const selectedNote = notes.find(note => note.id === noteId);

  if (!selectedNote) {
    throw json('No note found', { status: 404, statusText: 'Not Found' });
  }

  return selectedNote;
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}