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
