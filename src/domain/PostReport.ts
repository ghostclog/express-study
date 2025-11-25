import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { PostEn } from "./Post";

@Entity()
export class PostReport {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  reason!: string;

  @ManyToOne(() => User, { nullable: false, eager: true })
  @JoinColumn({ name: 'reporter_id' })
  reporter!: User;

  @ManyToOne(() => PostEn, { nullable: false })
  @JoinColumn({ name: 'post_id' })
  post!: PostEn;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
