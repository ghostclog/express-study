import { 
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, OneToOne,
  IsNull
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

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

  // 한 유저는 여러 게시글 작성 가능
  @OneToMany(() => Post, (post) => post.writer, { nullable: true })
  posts?: Post[];

  // 한 유저는 여러 댓글 작성 가능
  @OneToMany(() => PostComment, (postComment) => postComment.writer, { nullable: true })
  postComments?: PostComment[];

  @OneToOne(()=>UserProfile,(profile)=>profile.user, { nullable: true })
  profile?:UserProfile
}

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  comment?: string;

  @Column({ nullable: true })
  profile_image?: string; // 사진 경로로 static하게 할듯?

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(()=>User,(user)=>user.profile)
  user!: User;
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  contents!: string;

  @OneToMany(() => PostComment, (postComment) => postComment.post)
  postComments!: PostComment[];

  // 게시글 작성자는 User
  @ManyToOne(() => User, (user) => user.posts, { nullable: true })
  writer?: User;
}

@Entity()
export class PostComment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  contents!: string;

  // 댓글이 달린 게시글
  @ManyToOne(() => Post, (post) => post.postComments)
  post!: Post;  

  // 댓글 작성자
  @ManyToOne(() => User, (user) => user.postComments)
  writer!: User;
}