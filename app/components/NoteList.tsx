import type { LinksFunction } from "@remix-run/node"; 
import { Link, useLoaderData } from '@remix-run/react';
import styles from './NoteList.css?url';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

function NoteList() {
  const notes = useLoaderData();

  return (
    <ul id="note-list">
      {notes.map((note, index) => (
        <li key={note.id} className="note">
            <article>
            <a href={`/notes/${note.id}`}>
              <header>
                <ul className="note-meta">
                  <li>#{index + 1}</li>
                  <li>
                    <time dateTime={note.id}>
                      {new Date(note.id).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </li>
                </ul>
                <h2>{note.title}</h2>
              </header>
              </a>
              <p>{note.content}</p>
            </article>

        </li>
      ))}
    </ul>
  );
}

export default NoteList;
