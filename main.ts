import { Application } from 'jsr:@oak/oak/application';
import { Router } from 'jsr:@oak/oak/router';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import { LibraryData } from './data/library/index.ts';

const port = 8080;

const router = new Router();
router
  .get('/', oakCors(), async (context) => {
    const libraryFileVersion = await Deno.readTextFile('library.version.txt');

    const libraryFileVersionFormatted = `${libraryFileVersion} - ${new Date(
      Number(libraryFileVersion),
    )}`;

    const libraryDataFile = await Deno.readTextFile('library.json');
    const libraryData = JSON.parse(libraryDataFile) as LibraryData[];

    let libaryList = ``;

    for (let index = 0; index < libraryData.length; index++) {
      const book = libraryData[index];

      libaryList += `<li style="margin-bottom:16px; color: #383737">
      <span style="font-size:1.2rem; color: #000; margin-bottom:6px; display: block;">${book.book.name}</span>
      Phrases: ${book?.phrases?.length}, Groups ${
        book?.groups?.length || 0
      }, 📅:${
        new Date(
          book?.exportedAt,
        ).toLocaleString('en-In', { timeZone: 'Asia/Kolkata' })
      }
    </li>`;
    }

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
          <p>Updated at: ${
      new Date(
        Number(libraryFileVersion),
      ).toLocaleString('en-In', { timeZone: 'Asia/Kolkata' })
    } (India Standard Time)</p>
          <p>Version: ${libraryFileVersionFormatted}</p>
          <h2>API</h2>
          <ul>
            <li><a href="library">Library</a></li>
          </ul>
          <h2>Logs</h2>
          <b>Total: ${libraryData.length}</b>
          <details>
          <summary>Books</summary>
          <ul>
            ${libaryList}
          </ul>
        </details>

        </body>
      </html>
    `;
  })
  .options('/library', oakCors())
  .get('/library', oakCors(), async (context) => {
    await context.send({
      root: `${Deno.cwd()}/library.json`,
      path: '',
    });
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', () => {
  console.log(`Listening on localhost:${port}`);
});

await app.listen({ port });
