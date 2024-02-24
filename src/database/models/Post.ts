import { IPost } from '@/types';
import { Schema, model } from 'mongoose';

const PostSchema = new Schema(
  {
    id: {
      type: String,
      required: [true, 'Post ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Post title is required'],
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
    },
    image: {
      type: String,
      required: [true, 'Post image is required'],
    },
    authorId: {
      type: String,
      required: [true, 'Post author ID is required'],
    },
  },
  { timestamps: true, versionKey: false },
);

export const PostModel = model<IPost>('Post', PostSchema);
