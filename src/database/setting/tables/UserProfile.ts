import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, OneToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  comment?: string;

  @Column({ nullable: true })
  profile_image?: string;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => User, (user) => user.profile)
  user!: User;
}
