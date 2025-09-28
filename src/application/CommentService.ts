import PostOrmRepo from '../database/orm_modules/post_orm_repo';
import { CommentEn } from '../domain/Post';

const postRepo = new PostOrmRepo();

class CommentService {
    async createComment(comment: CommentEn, writerId: number) {
        return await postRepo.createComment(comment, writerId);
    }

    async getCommentsByPostId(postId: number) {
        return await postRepo.getCommentsByPostId(postId);
    }

    async getCommentById(commentId: number) {
        return await postRepo.getCommentById(commentId);
    }

    async updateComment(commentId: number, contents: string) {
        return await postRepo.updateComment(commentId, contents);
    }

    async deleteComment(commentId: number) {
        return await postRepo.deleteComment(commentId);
    }
}

export default CommentService;
