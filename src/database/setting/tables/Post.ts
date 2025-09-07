import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { User } from "./user";
import { PostComment } from "./PostComment";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  contents!: string;

  @OneToMany(() => PostComment, (postComment) => postComment.post)
  postComments!: PostComment[];

  @ManyToOne(() => User, (user) => user.posts, { nullable: true })
  writer?: User;
}
