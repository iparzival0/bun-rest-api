import { UserRoleFlags } from '@/enums';

export interface IPost {
  id: string;
  title: string;
  content: string;
  image: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: string;
  username: string;
  password: string;
  email: string;
  role: UserRoleFlags;
  posts: IPost[];
  createdAt: Date;
  updatedAt: Date;
}
