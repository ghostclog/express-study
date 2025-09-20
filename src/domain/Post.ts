import { UserEn } from "./User";

export enum PostType {
  COMMON = "common",
  CLIP = "clip",
  VIDEO_SHARE = "vedio_share",
}

export class CommentEn {
    id!: number;
    contents!: string;
    post_id!: number;
    writer!: UserEn;
  }
  
export class PostEn  {
  id!: number;
  title!: string;
  mp4_url!: string;
  contents!: string;
  post_type!: PostType;
  comments!: CommentEn[];
  writer?: UserEn;
  createdAt?: Date;
  updatedAt?: Date;
}

