import { AppDataSource, Post, Video } from "./../setting/config";

import fs from 'fs';

const postRepo = AppDataSource.getRepository(Post);
const videoRepo = AppDataSource.getRepository(Video);

class VideoOrmRepo {
    async saveVideo(file: Express.Multer.File, postId?: number | null): Promise<Video> {
        let post: Post | null = null;
        if (postId) {
            post = await postRepo.findOne({ where: { id: postId }, relations: ["video"] });
            if (!post) {
                fs.unlinkSync(file.path);
                throw new Error('Post not found');
            }

            if (post.video) {
                try {
                    await fs.promises.unlink(post.video.file_path);
                } catch (err) {
                    console.error(`Failed to delete old video file: ${post.video.file_path}`, err);
                }
                await videoRepo.delete(post.video.id);
            }
        }

        const videoData: Partial<Video> = {
            original_name: file.originalname,
            file_path: file.path,
            mimetype: file.mimetype,
            size: file.size,
        };

        if (post) {
            videoData.post = post;
        }

        const newVideo = videoRepo.create(videoData);

        const savedVideo = await videoRepo.save(newVideo);
        return savedVideo;
    }

    async getVideoByPostId(postId: number): Promise<Video | null> {
        const video = await videoRepo.findOne({
            where: { post: { id: postId } }
        });
        return video;
    }
}

export default VideoOrmRepo;
