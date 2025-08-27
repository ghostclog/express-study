import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;  // non-null assertion

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
}
