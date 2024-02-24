import { PostModel } from '@/database/models';
import { IPost } from '@/types';
import { Elysia, t } from 'elysia';

export const PostsController = (app: Elysia) =>
  // @ts-ignore
  app.group('/posts', (app: Elysia) =>
    app
      .guard(
        {
          body: t.Object({
            id: t.String(),
            title: t.String(),
            content: t.String(),
            authorId: t.String(),
            image: t.String(),
          }),
        },
        (app: Elysia) =>
          app.post('/create', async (handler) => {
            const { id, title, content, authorId, image } = handler.body as any;
            const newPost = new PostModel({
              id,
              title,
              content,
              authorId,
              image,
            });

            await newPost.save();

            handler.set.status = 201;

            return newPost;
          }),
      )
      .get('/', async (handler) => {
        const posts = await PostModel.find();
        handler.set.status = 200;

        return posts;
      })
      .get('/:id', async (handler) => {
        const post = await PostModel.findOne({ id: handler.params.id });
        handler.set.status = 200;

        return post;
      })
      .delete('/:id', async (handler) => {
        const post = await PostModel.findOneAndDelete({
          id: handler.params.id,
        });
        handler.set.status = 200;
        return post;
      })
      .put('/:id', async (handler) => {
        const id = handler.params.id;
        const changes = handler.body as Partial<IPost>;

        const post = await PostModel.findOneAndUpdate(
          { id },
          { $set: changes },
          { new: true },
        );
        handler.set.status = 200;
        return post;
      }),
  );
