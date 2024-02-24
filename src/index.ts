import { Elysia } from 'elysia';
import { usersController } from './controllers/users-controller';
import { connectToDatabase } from './database/connect';
import { PostsController } from './controllers/posts-controller';

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
