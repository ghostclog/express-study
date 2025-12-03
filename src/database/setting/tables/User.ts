import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { UserProfile } from "./UserProfile";
import { Post } from "./Post";
import { PostComment } from "./PostComment";
import { PostReport } from "./PostReport";

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

  @Column({ nullable: true })
  user_account_status?: 'active' | 'inactive' | 'banned';

  @Column({ type: 'int', default: 0 })
  permission_level!: number;

  @Column({ type: 'timestamp', nullable: true })
  banned_at?: Date;

  @OneToMany(() => Post, (post) => post.writer)
  posts?: Post[];

  @OneToMany(() => PostComment, (postComment) => postComment.writer)
  postComments?: PostComment[];

  @OneToMany(() => PostReport, (report) => report.reporter)
  reportedPosts?: PostReport[];

  @OneToOne(() => UserProfile, (profile) => profile.user, { nullable: true })
  profile?: UserProfile;
}
