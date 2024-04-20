import fs from 'fs/promises';

const FILE_PATH = 'app/mock/notes.json';

export async function getStoredNotes() {
  const rawFileContent = await fs.readFile(FILE_PATH, { encoding: 'utf-8' });
  const data = JSON.parse(rawFileContent);
  const storedNotes = data.notes ?? [];
  return storedNotes;
}

export function storeNotes(notes) {
  return fs.writeFile(FILE_PATH, JSON.stringify({ notes: notes || [] }));
}