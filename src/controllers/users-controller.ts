import { Elysia, Handler, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { UserModel } from '../database/models/User';
import { IUser } from '@/types';

export const usersController = (app: Elysia) =>
  // @ts-ignore
  app.group('/users', (app: Elysia) =>
    app

      // Using JWT
      .use(
        jwt({
          name: 'jwt',
          secret: 'secret',
        }),
      )

      // Validating required properties using Guard schema
      .guard(
        {
          body: t.Object({
            username: t.String(),
            email: t.String(),
            password: t.String(),
            id: t.String(),
          }),
        },
        (app: Elysia) =>
          app
            // This route is protected by the Guard above
            .post(
              '/',
              async (handler) => {
                try {
                  const { id, username, password, email } =
                    handler.body as IUser;
                  const newUser = new UserModel({
                    id,
                    username,
                    password,
                    email,
                  });
                  newUser.username = (handler.body as any).username;
                  newUser.email = (handler.body as any).email;
                  newUser.password = (handler.body as any).password;

                  const savedUser = await newUser.save();

                  // JWT payload is based off user id
                  const accessToken = await (handler as any).jwt.sign({
                    userId: savedUser._id,
                  });

                  // Returning JTW to the client (via headers)
                  handler.set.headers = {
                    'X-Authorization': accessToken,
                  };
                  handler.set.status = 201;

                  return newUser;
                } catch (e: any) {
                  console.log(e);
                  // If unique mongoose constraint (for username or email) is violated
                  if (e.name === 'MongoServerError' && e.code === 11000) {
                    handler.set.status = 422;
                    return {
                      message: 'Resource already exists!',
                      status: 422,
                    };
                  }

                  handler.set.status = 500;
                  return {
                    message: 'Unable to save entry to the database!',
                    status: 500,
                  };
                }
              },
              {
                error(handler) {
                  console.log(
                    `wwwwwww  Handler - Status Code: ${handler.set.status}`,
                  );
                },
              },
            ),
      )

      // Guard does not affect the following routes
      .get('/', async ({ set }) => {
        try {
          const users = await UserModel.find({});
          return users;
        } catch (e: unknown) {
          set.status = 500;
          return {
            message: 'Unable to retrieve items from the database!',
            status: 500,
          };
        }
      })

      .get('/:id', async (handler) => {
        try {
          const { id } = handler.params;

          const existingUser = await UserModel.findOne({ id });

          if (!existingUser) {
            handler.set.status = 404;
            return {
              message: 'Requested resource was not found!',
              status: 404,
            };
          }

          return existingUser;
        } catch (e: unknown) {
          handler.set.status = 500;
          return {
            message: 'Unable to retrieve the resource!',
            status: 500,
          };
        }
      })

      .patch('/:id', async (handler) => {
        try {
          const { id } = handler.params;

          const changes: Partial<IUser> = handler.body as Partial<IUser>;

          const updatedUser = await UserModel.findOneAndUpdate(
            { id },
            { $set: { ...changes } },
            { new: true },
          );

          if (!updatedUser) {
            handler.set.status = 404;
            return {
              message: `User with id: ${id} was not found.`,
              status: 404,
            };
          }

          return updatedUser;
        } catch (e: unknown) {
          console.log(e);
          handler.set.status = 500;
          return {
            message: 'Unable to update resource!',
            status: 500,
          };
        }
      })

      .delete('/:id', async (handler) => {
        try {
          const { id } = handler.params;

          const existingUser = await UserModel.findOne({ id });

          if (!existingUser) {
            handler.set.status = 404;
            return {
              message: `User with id: ${id} was not found.`,
              status: 404,
            };
          }

          await UserModel.findOneAndDelete({ id });

          return {
            message: `Resource deleted successfully!`,
            status: 200,
          };
        } catch (e: unknown) {
          handler.set.status = 500;
          return {
            message: 'Unable to delete resource!',
            status: 500,
          };
        }
      }),
  );
