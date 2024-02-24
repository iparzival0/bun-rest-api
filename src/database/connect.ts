import { connect, set } from 'mongoose';

export const connectToDatabase = async (): Promise<void> => {
  try {
    await connect('mongodb://localhost:27017/bun-rest-api');

    set('strictQuery', false);
  } catch (e: unknown) {
    console.error('Unable to connect to the database!');
    process.exit(1);
  }
};
