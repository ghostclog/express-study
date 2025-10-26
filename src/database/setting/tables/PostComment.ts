import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class PostComment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  contents!: string;

  @ManyToOne(() => Post, (post) => post.postComments)
  @JoinColumn()
  post!: Post;

  @ManyToOne(() => User, (user) => user.postComments)
  @JoinColumn()
  writer!: User;
}
