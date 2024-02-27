import { Elysia } from 'elysia';
import { PostsController, usersController } from './controllers';
import { connectToDatabase } from './database/connect';

const app = new Elysia();

connectToDatabase();

// @ts-ignore
app.group('/api', (app: Elysia) => app.use(usersController));
// @ts-ignore
app.group('/api', (app: Elysia) => app.use(PostsController));

app.listen(5000);

console.log(
  `Project is running at http://${app.server?.hostname}:${app.server?.port}`,
);
