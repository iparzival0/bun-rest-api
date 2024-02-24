import { PostModel } from '@/database/models';
import { CreatePostDto, PostFilterDto, UpdatePostDto } from '@/dtos';
import { IPost } from '@/types';

export class PostService {
  public static async getPosts(): Promise<IPost[]> {
    return await PostModel.find().lean();
  }

  public static async getPostById(id: string): Promise<IPost | null> {
    return await PostModel.findOne({ id }).lean();
  }

  public static async createPost(post: CreatePostDto): Promise<IPost> {
    return await PostModel.create(post);
  }

  public static async updatePost(
    id: string,
    post: UpdatePostDto,
  ): Promise<any> {
    return await PostModel.updateOne({ id }, { $set: post });
  }

  public static async deletePost(id: string): Promise<any> {
    return await PostModel.deleteOne({ id });
  }

  public static async getPostsByFilter(
    filter: PostFilterDto,
  ): Promise<IPost[]> {
    const { title, authorId, order } = filter;
    if (title && !authorId && !order)
      return await PostModel.find({ title }).lean();
    if (authorId && !title && !order)
      return await PostModel.find({ authorId }).lean();
    if (order && !title && !authorId)
      return await PostModel.find().sort({ createdAt: order }).lean();
    if (title && authorId && !order)
      return await PostModel.find({
        title,
        authorId,
      }).lean();
    if (title && order && !authorId)
      return await PostModel.find({
        title,
      })
        .sort({ createdAt: order })
        .lean();
    if (authorId && order && !title)
      return await PostModel.find({
        authorId,
      })
        .sort({ createdAt: order })
        .lean();
    if (title && authorId && order)
      return await PostModel.find({
        title,
        authorId,
      })
        .sort({ createdAt: order })
        .lean();
    return await PostModel.find().lean();
  }

  public static async getPostByTitle(title: string): Promise<IPost | null> {
    return await PostModel.findOne({
      title: { $regex: new RegExp(title, 'i') },
    }).lean();
  }

  public static async getPostByAuthor(author: string): Promise<IPost[] | null> {
    return await PostModel.find({
      authorId: { $regex: new RegExp(author, 'i') },
    }).lean();
  }
}
