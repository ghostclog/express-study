

export class UserEn {
  id!: number;
  email!: string;
  password?: string;
  name?: string;
  count_post: number = 0;
  count_comment: number = 0;
  comment?: string;
  profile_image?: string;

  createdAt?: Date;
  updatedAt?: Date;
}