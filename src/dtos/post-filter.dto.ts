export class PostFilterDto {
  public authorId!: string;
  public title?: string;
  public order?: 'asc' | 'desc';
}
