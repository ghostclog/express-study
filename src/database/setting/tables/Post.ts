import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from "typeorm";
import { Video } from "./Video";
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


  @Column()
  post_type!: string; // 클립, 일반, 영상 공유 세가지로 나눠질거같음.
  
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => PostComment, (postComment) => postComment.post)
  postComments!: PostComment[];

  @ManyToOne(() => User, (user) => user.posts, { nullable: true })
  @JoinColumn()
  writer?: User;

  @OneToOne(() => Video, video => video.post, {
    nullable: true,
    cascade: true,
  })
  video?: Video;
}
