import { UserRoleFlags } from '@/enums';
import { IUser } from '@/types';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    role: {
      type: Number,
      default: UserRoleFlags.User,
    },
    posts: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, versionKey: false },
);

export const UserModel = model<IUser>('User', UserSchema);
