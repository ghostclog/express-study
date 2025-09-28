import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  comment?: string;

  @Column({ nullable: true })
  profile_image?: string;

  @Column({ type: "datetime" })
  updatedAt!: Date;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user!: User;
}
