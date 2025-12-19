import { PostReportOrmRepo } from './../database/orm_modules/post_report_orm_repo';
import PostOrmRepo from '../database/orm_modules/post_orm_repo';
import { PostEn, PostType } from '../domain/Post';
import { PostReport } from '../database/setting/tables/PostReport';

// 서비스는 레포지토리에 의존
const postRepo = new PostOrmRepo();

class PostService {
    // repo에 있던 모든 post 관련 메서드를 service로 이동하거나 위임
    async createPost(post: PostEn, writerId: number, videoId?: number): Promise<PostEn> {
        return await postRepo.createPost(post, writerId, videoId);
    }

    async getPostById(id: number): Promise<PostEn | null> {
        return await postRepo.getPostById(id);
    }

    async getAllPosts(blacklistedUserIds?: number[]): Promise<PostEn[]> {
        return await postRepo.getAllPosts(blacklistedUserIds);
    }

    async updatePost(id: number, postData: Partial<PostEn>): Promise<PostEn | null> {
        return await postRepo.updatePost(id, postData);
    }

    async deletePost(id: number): Promise<boolean> {
        return await postRepo.deletePost(id);
    }

    // 신고 로직은 서비스 계층에 유지
    async reportPost(postId: number, reason: string, reporterId: number): Promise<PostReport> {
        // 실제 DB 작업은 repo 계층에 위임
        return await postRepo.createPostReport(postId, reason, reporterId);
    }

    async getAllPostReports(): Promise<PostReport[]> {
        return await postRepo.getAllPostReports();
    }

    async resolvePostReport(reportId: number): Promise<PostReport | null> {
        await PostReportOrmRepo.update(reportId, { status: 'resolved' });
        return await PostReportOrmRepo.findOneBy({ id: reportId });
    }
}

export default PostService;