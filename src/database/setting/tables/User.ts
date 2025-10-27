import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { PostComment } from "./PostComment";
import { Post } from "./Post";
import { UserProfile } from "./UserProfile";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  name?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Post, (post) => post.writer, { nullable: true })
  posts?: Post[];

  @OneToMany(() => PostComment, (postComment) => postComment.writer, { nullable: true })
  postComments?: PostComment[];

  @OneToOne(() => UserProfile, (profile) => profile.user, { nullable: true })
  profile?: UserProfile;
}
