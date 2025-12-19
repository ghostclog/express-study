import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class UserReport {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  report_text!: string;

  @Column()
  reported_user_id!: number;

  @Column({ nullable: true })
  report_proviso!: string;

  @Column()
  reporter_id!: number;

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity()
export class BlackList {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  owner_id!: number; // 차단한 사람

  @Column()
  target_id!: number; // 차단 당한 사람

  @CreateDateColumn()
  createdAt!: Date;
}