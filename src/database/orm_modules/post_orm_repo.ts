import { AppDataSource, PostComment, Post, User } from "./../setting/config";
import { PostEn, CommentEn, PostType } from './../../domain/Post';
import { UserEn } from './../../domain/User';

class PostOrmRepo {
    private postRepo = AppDataSource.getRepository(Post);
    private commentRepo = AppDataSource.getRepository(PostComment);
    private userRepo = AppDataSource.getRepository(User);

    // Post CRUD
    async createPost(post: PostEn, writerId: number): Promise<PostEn> {
        const writer = await this.userRepo.findOneBy({ id: writerId });
        if (!writer) {
            throw new Error("User not found");
        }
        const newPostEntity = this.postRepo.create({
            title: post.title,
            mp4_url: post.mp4_url,
            contents: post.contents,
            post_type: post.post_type,
            writer: writer
        });
        await this.postRepo.save(newPostEntity);

        const newPostEn = new PostEn();
        newPostEn.id = newPostEntity.id;
        newPostEn.title = newPostEntity.title;
        newPostEn.mp4_url = newPostEntity.mp4_url;
        newPostEn.contents = newPostEntity.contents;
        newPostEn.post_type = newPostEntity.post_type as PostType;
        if (newPostEntity.writer) {
            const writerEn = new UserEn();
            writerEn.id = newPostEntity.writer.id;
            writerEn.email = newPostEntity.writer.email;
            writerEn.name = newPostEntity.writer.name;
            newPostEn.writer = writerEn;
        }
        return newPostEn;
    }

    async getPostById(id: number): Promise<PostEn | null> {
        const postEntity = await this.postRepo.findOne({
            where: { id },
            relations: ["writer", "postComments", "postComments.writer"],
        });
        if (!postEntity) return null;

        const postEn = new PostEn();
        postEn.id = postEntity.id;
        postEn.title = postEntity.title;
        postEn.mp4_url = postEntity.mp4_url;
        postEn.contents = postEntity.contents;
        postEn.post_type = postEntity.post_type as PostType;
        if (postEntity.writer) {
            const writerEn = new UserEn();
            writerEn.id = postEntity.writer.id;
            writerEn.email = postEntity.writer.email;
            writerEn.name = postEntity.writer.name;
            postEn.writer = writerEn;
        }
        if (postEntity.postComments) {
            postEn.comments = postEntity.postComments.map(commentEntity => {
                const commentEn = new CommentEn();
                commentEn.id = commentEntity.id;
                commentEn.contents = commentEntity.contents;
                commentEn.post_id = postEntity.id;
                if (commentEntity.writer) {
                    const writerEn = new UserEn();
                    writerEn.id = commentEntity.writer.id;
                    writerEn.email = commentEntity.writer.email;
                    writerEn.name = commentEntity.writer.name;
                    commentEn.writer = writerEn;
                }
                return commentEn;
            });
        }
        return postEn;
    }

    async getAllPosts(): Promise<PostEn[]> {
        const postEntities = await this.postRepo.find({
            relations: ["writer"],
            order: { createdAt: "DESC" }
        });

        return postEntities.map(postEntity => {
            const postEn = new PostEn();
            postEn.id = postEntity.id;
            postEn.title = postEntity.title;
            postEn.post_type = postEntity.post_type as PostType;
            postEn.createdAt = postEntity.createdAt;
            if (postEntity.writer) {
                const writerEn = new UserEn();
                writerEn.id = postEntity.writer.id;
                writerEn.email = postEntity.writer.email;
                writerEn.name = postEntity.writer.name;
                postEn.writer = writerEn;
            }
            return postEn;
        });
    }

    async updatePost(id: number, postData: Partial<PostEn>): Promise<PostEn | null> {
        await this.postRepo.update(id, postData);
        return this.getPostById(id);
    }

    async deletePost(id: number): Promise<boolean> {
        const result = await this.postRepo.delete(id);
        return result.affected !== 0;
    }

    // Comment CRUD
    async createComment(comment: CommentEn, writerId: number): Promise<CommentEn> {
        const writerEntity = await this.userRepo.findOneBy({ id: writerId });
        const postEntity = await this.postRepo.findOneBy({ id: comment.post_id });

        if (!writerEntity || !postEntity) {
            throw new Error("User or Post not found");
        }

        const newCommentEntity = this.commentRepo.create({
            contents: comment.contents,
            writer: writerEntity,
            post: postEntity,
        });
        await this.commentRepo.save(newCommentEntity);

        const newCommentEn = new CommentEn();
        newCommentEn.id = newCommentEntity.id;
        newCommentEn.contents = newCommentEntity.contents;
        newCommentEn.post_id = newCommentEntity.post.id;
        const writerEn = new UserEn();
        writerEn.id = writerEntity.id;
        writerEn.email = writerEntity.email;
        writerEn.name = writerEntity.name;
        newCommentEn.writer = writerEn;
        return newCommentEn;
    }

    async getCommentsByPostId(postId: number): Promise<CommentEn[]> {
        const commentEntities = await this.commentRepo.find({
            where: { post: { id: postId } },
            relations: ["writer", "post"],
        });

        return commentEntities.map(commentEntity => {
            const commentEn = new CommentEn();
            commentEn.id = commentEntity.id;
            commentEn.contents = commentEntity.contents;
            commentEn.post_id = commentEntity.post.id;
            if (commentEntity.writer) {
                const writerEn = new UserEn();
                writerEn.id = commentEntity.writer.id;
                writerEn.email = commentEntity.writer.email;
                writerEn.name = commentEntity.writer.name;
                commentEn.writer = writerEn;
            }
            return commentEn;
        });
    }

    async getCommentsByUserId(userId: number): Promise<CommentEn[]> {
        const commentEntities = await this.commentRepo.find({
            where: { writer: { id: userId } },
            relations: ["writer", "post"],
        });

        return commentEntities.map(commentEntity => {
            const commentEn = new CommentEn();
            commentEn.id = commentEntity.id;
            commentEn.contents = commentEntity.contents;
            commentEn.post_id = commentEntity.post.id;
            if (commentEntity.writer) {
                const writerEn = new UserEn();
                writerEn.id = commentEntity.writer.id;
                writerEn.email = commentEntity.writer.email;
                writerEn.name = commentEntity.writer.name;
                commentEn.writer = writerEn;
            }
            return commentEn;
        });
    }

    async getCommentById(id: number): Promise<CommentEn | null> {
        const commentEntity = await this.commentRepo.findOne({
            where: { id },
            relations: ["writer", "post"],
        });
        if (!commentEntity) return null;

        const commentEn = new CommentEn();
        commentEn.id = commentEntity.id;
        commentEn.contents = commentEntity.contents;
        commentEn.post_id = commentEntity.post.id;
        if (commentEntity.writer) {
            const writerEn = new UserEn();
            writerEn.id = commentEntity.writer.id;
            writerEn.email = commentEntity.writer.email;
            writerEn.name = commentEntity.writer.name;
            commentEn.writer = writerEn;
        }
        return commentEn;
    }

    async updateComment(id: number, contents: string): Promise<CommentEn | null> {
        await this.commentRepo.update(id, { contents });
        return this.getCommentById(id);
    }

    async deleteComment(id: number): Promise<boolean> {
        const result = await this.commentRepo.delete(id);
        return result.affected !== 0;
    }
}

export default PostOrmRepo;