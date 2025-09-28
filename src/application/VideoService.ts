import VideoOrmRepo from '../database/orm_modules/video_orm_repo';

const videoRepo = new VideoOrmRepo();

class VideoService {
    async saveVideo(file: Express.Multer.File, postId: number) {
        return await videoRepo.saveVideo(file, postId);
    }
}

export default VideoService;
