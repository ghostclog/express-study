import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class Video {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    original_name!: string;

    @Column()
    file_path!: string;

    @Column()
    mimetype!: string;

    @Column({ type: 'int' })
    size!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToOne(() => Post, post => post.video)
    @JoinColumn()
    post!: Post;
}
