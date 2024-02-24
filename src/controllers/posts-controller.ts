import { PostModel } from '@/database/models';
import { PostService } from '@/services';
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

            const newPost = await PostService.createPost({
              id,
              title,
              content,
              authorId,
              image,
            });

            handler.set.status = 201;

            return newPost;
          }),
      )
      .get('/', async (handler) => {
        const filter = handler.query as any;
        let posts: IPost[];

        if (!filter) posts = await PostService.getPosts();
        else posts = await PostService.getPostsByFilter(filter);

        if (!posts || posts.length < 1) {
          handler.set.status = 404;
          return { message: 'No posts found', status: 404 };
        }

        handler.set.status = 200;

        return posts;
      })
      .get('/:id', async (handler) => {
        if (!handler.params.id) {
          handler.set.status = 400;
          return { message: 'No id provided', status: 400 };
        }

        const post = await PostService.getPostById(handler.params.id);
        if (!post) {
          handler.set.status = 404;
          return { message: 'Post not found', status: 404 };
        }

        handler.set.status = 200;

        return post;
      })
      .get('/', async (handler) => {
        if (!handler.query.authorId) {
          handler.set.status = 400;
          return { message: 'No author id provided', status: 400 };
        }

        const posts = await PostService.getPostByAuthor(handler.query.authorId);
        if (!posts || posts.length < 1) {
          handler.set.status = 404;
          return { message: 'No posts found', status: 404 };
        }

        handler.set.status = 200;

        return posts;
      })
      .delete('/:id', async (handler) => {
        if (!handler.params.id) {
          handler.set.status = 400;
          return { message: 'No id provided', status: 400 };
        }

        const post = await PostService.deletePost(handler.params.id);
        if (!post) {
          handler.set.status = 404;
          return { message: 'Post not found', status: 404 };
        }
        handler.set.status = 200;
        return post;
      })
      .put('/:id', async (handler) => {
        const id = handler.params.id;
        const changes = handler.body as Partial<IPost>;

        if (!id) {
          handler.set.status = 400;
          return { message: 'No id provided', status: 400 };
        }
        if (!changes) {
          handler.set.status = 400;
          return { message: 'No changes provided', status: 400 };
        }

        const post = await PostModel.findOneAndUpdate(
          { id },
          { $set: changes },
          { new: true },
        );
        if (!post) {
          handler.set.status = 404;
          return { message: 'Post not found', status: 404 };
        }
        handler.set.status = 200;
        return post;
      }),
  );
