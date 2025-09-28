import { UserEn } from "./User";
import { Video } from "../database/setting/tables/Video";

export enum PostType {
  COMMON = "common",
  CLIP = "clip",
  VIDEO_SHARE = "video_share",
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
  contents!: string;
  post_type!: PostType;
  comments!: CommentEn[];
  writer?: UserEn;
  createdAt?: Date;
  updatedAt?: Date;
  comment_count?: number;
  video?: Video;
}

