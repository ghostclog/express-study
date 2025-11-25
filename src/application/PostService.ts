import { AppDataSource } from "../database/setting/config";
import { PostEn, PostType } from "../domain/Post";
import { Video } from '../domain/Video';
import { User } from '../domain/User';
import { PostReport } from "../domain/PostReport";

export default class PostService {
  private postRepository = AppDataSource.getRepository(PostEn);
  private userRepository = AppDataSource.getRepository(User);
  private reportRepository = AppDataSource.getRepository(PostReport);

  async getAllPosts() {
    return this.postRepository.find({ relations: ['writer', 'video'] });
  }

  async getPostById(id: number) {
    return this.postRepository.findOne({ where: { id }, relations: ['writer', 'video'] });
  }

  async createPost(postData: Partial<PostEn>, writerId: number, videoId?: number): Promise<PostEn> {
    const writer = await this.userRepository.findOneBy({ id: writerId });
    if (!writer) {
      throw new Error("Writer not found");
    }

    const newPost = this.postRepository.create({
      ...postData,
      writer: writer,
    });

    if (videoId) {
      const videoRepository = AppDataSource.getRepository(Video);
      const video = await videoRepository.findOneBy({id: videoId});
      if(video) newPost.video = video;
    }
    
    return this.postRepository.save(newPost);
  }

  async updatePost(id: number, postData: Partial<PostEn>): Promise<PostEn | null> {
    await this.postRepository.update(id, postData);
    return this.getPostById(id);
  }

  async deletePost(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }

  async reportPost(postId: number, reason: string, reporterId: number): Promise<PostReport> {
    const post = await this.getPostById(postId);
    if (!post) {
      throw new Error('신고할 게시글을 찾을 수 없습니다.');
    }

    const reporter = await this.userRepository.findOneBy({ id: reporterId });
    if (!reporter) {
      throw new Error('신고한 사용자를 찾을 수 없습니다.');
    }

    const report = this.reportRepository.create({
      post: post,
      reporter: reporter,
      reason: reason,
    });

    return this.reportRepository.save(report);
  }
}