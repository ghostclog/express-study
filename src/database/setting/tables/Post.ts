import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn
} from "typeorm";
import { User } from "./User";
import { PostComment } from "./PostComment";
import { Video } from "./Video";
import { PostReport } from "./PostReport";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  contents!: string;


  @Column()
  post_type!: string; // 클립, 일반, 영상 공유 세가지로 나눠질거같음.
  
  @Column({ default: 0 })
  comment_count?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => PostComment, (postComment) => postComment.post)
  postComments?: PostComment[];

  @OneToMany(() => PostReport, (report) => report.post)
  reports?: PostReport[];

  @ManyToOne(() => User, (user) => user.posts, { nullable: true })
  @JoinColumn()
  writer?: User;

  @OneToOne(() => Video, video => video.post)
  video?: Video;
}
