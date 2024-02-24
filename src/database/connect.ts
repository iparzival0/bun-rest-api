import { connect, set } from 'mongoose';

export const connectToDatabase = async (): Promise<void> => {
  try {
    await connect('mongodb://localhost:27017/bun-rest-api');

    set('strictQuery', false);
    console.log('Connected to the database!');
  } catch (error: any) {
    console.error(
      `Unable to connect to the database!\n\n ${error.name}: ${error.message}`,
    );
    process.exit(1);
  }
};
