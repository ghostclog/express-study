import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity({ name: 'post_reports' })
export class PostReport {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  reason!: string;

  @ManyToOne(() => User, user => user.reportedPosts, { nullable: false, eager: true })
  @JoinColumn({ name: 'reporter_id' })
  reporter!: User;

  @ManyToOne(() => Post, post => post.reports, { nullable: false })
  @JoinColumn({ name: 'post_id' })
  post!: Post;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
