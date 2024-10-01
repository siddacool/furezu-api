import { Application } from 'jsr:@oak/oak/application';
import { Router } from 'jsr:@oak/oak/router';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import { getLibrary } from './data/library/index.ts';

const router = new Router();
router
  .get('/', oakCors(), (context) => {
    context.response.body = 'Hello world!';
  })
  .options('/library', oakCors())
  .get('/library', oakCors(), async (context) => {
    const res = await getLibrary('./data/library/books');

    context.response.body = res;
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
