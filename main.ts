import { Application } from 'jsr:@oak/oak/application';
import { Router } from 'jsr:@oak/oak/router';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import { getLibrary, LibraryData } from './data/library/index.ts';

const booksPath = './data/library/books';

await buildLibraryCache();

export async function buildLibraryCache() {
  try {
    const library = await getLibrary(booksPath);

    await Deno.writeTextFile('library.json', JSON.stringify(library));
    await Deno.writeTextFile(
      'library.version.txt',
      `${Date.now()}`,
    );
  } catch (e) {
    console.error(e);
  }
}

const router = new Router();
router
  .get('/', oakCors(), (context) => {
    context.response.body = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
          <h1>Furezu API</h1>
          <ul>
            <li><a href="library">Library</a></li>
          </ul>
        </body>
      </html>
    `;
  })
  .options('/library', oakCors())
  .get('/library', oakCors(), async (context) => {
    const libraryFile = await Deno.readTextFile('library.json');
    const data = JSON.parse(libraryFile) as LibraryData[];

    context.response.body = data;
  }).options('/library-cache-version', oakCors())
  .get('/library-cache-version', oakCors(), async (context) => {
    const libraryFileVersion = await Deno.readTextFile('library.version.txt');

    context.response.body = libraryFileVersion;
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
