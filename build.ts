import { getLibrary } from './data/library/index.ts';

const path = './data/library/books';

async function start() {
  try {
    const library = await getLibrary(path);

    await Deno.writeTextFile('library.json', JSON.stringify(library));
    await Deno.writeTextFile(
      'library.version.txt',
      `${Date.now()}`,
    );
  } catch (e) {
    console.error(e);
  }
}

start();
