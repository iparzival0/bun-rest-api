import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  public id!: string;
  public title!: string;
  public content!: string;
  public authorId!: string;
  public image!: string;
}
