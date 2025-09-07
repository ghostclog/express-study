import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Post } from "./Post";
import { User } from "./user";

@Entity()
export class PostComment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  contents!: string;

  @ManyToOne(() => Post, (post) => post.postComments)
  post!: Post;

  @ManyToOne(() => User, (user) => user.postComments)
  writer!: User;
}
