import { Application } from 'jsr:@oak/oak/application';
import { Router } from 'jsr:@oak/oak/router';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';

// deno-lint-ignore no-explicit-any
const books = new Map<string, any>();
books.set('1', {
  id: '1',
  title: 'The Hound of the Baskervilles',
  author: 'Conan Doyle, Arthur',
});

const router = new Router();
router
  .get('/', oakCors(), (context) => {
    context.response.body = 'Hello world!';
  })
  .get('/book', oakCors(), (context) => {
    context.response.body = Array.from(books.values());
  })
  .get('/book/:id', oakCors(), (context) => {
    if (books.has(context?.params?.id)) {
      context.response.body = books.get(context.params.id);
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
