import { getLibrary } from './data/library/index.ts';

const BOOKS_PATH = './data/library/books';

try {
  const library = await getLibrary(BOOKS_PATH);

  await Deno.writeTextFile('library.json', JSON.stringify(library));
  await Deno.writeTextFile(
    'library.version.txt',
    `${Date.now()}`,
  );
} catch (err) {
  console.error('Error creating cache:', err);
}
