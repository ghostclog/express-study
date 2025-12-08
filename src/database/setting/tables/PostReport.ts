import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class PostReport {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  reporter_id!: number;

  @Column()
  reported_post_id!: number;
  
  @Column()
  reported_user_id!: number;

  @Column('text')
  reason!: string;

  @Column({ type: 'text' })
  archived_post_data!: string; // JSON string of post snapshot

  @Column({ default: 'pending' })
  status!: 'pending' | 'resolved';

  @CreateDateColumn()
  createdAt!: Date;
}
