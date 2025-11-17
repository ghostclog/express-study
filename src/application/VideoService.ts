import VideoOrmRepo from '../database/orm_modules/video_orm_repo';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { Video } from '../database/setting/tables/Video';

const videoRepo = new VideoOrmRepo();

class VideoService {
    async saveVideo(file: Express.Multer.File, postId: number) {
        return await videoRepo.saveVideo(file, postId);
    }

    async createClip(postId: number, startTime: number, endTime: number, title: string): Promise<Video> {
        const video = await videoRepo.getVideoByPostId(postId);
        if (!video) {
            throw new Error('Video not found for the given post.');
        }

        const inputPath = video.file_path;
        const clipDir = path.join('uploads', 'clips');
        
        if (!fs.existsSync(clipDir)) {
            fs.mkdirSync(clipDir, { recursive: true });
        }
        
        const outputFileName = `클립_${Date.now()}.mp4`;
        const outputPath = path.join(clipDir, outputFileName);

        return new Promise((resolve, reject) => {
            const ffmpeg = spawn('ffmpeg', [
                '-i', inputPath,
                '-ss', startTime.toString(),
                '-to', endTime.toString(),
                '-c', 'copy',
                outputPath
            ]);

            ffmpeg.on('close', async (code) => {
                if (code === 0) {
                    console.log(`Clip created successfully: ${outputPath}`);
                    
                    const originalFile = {
                        originalname: outputFileName,
                        mimetype: video.mimetype, // 원본 영상과 동일한 mimetype 사용
                        path: outputPath,
                        size: fs.statSync(outputPath).size
                    };
                    
                    // 클립에 대한 post ID는 null로 설정하여 특정 게시물에 종속되지 않도록 함
                    const newVideo = await videoRepo.saveVideo(originalFile as Express.Multer.File);
                    resolve(newVideo);

                } else {
                    console.error(`FFmpeg exited with code ${code}`);
                    reject(new Error(`FFmpeg failed to create clip. Code: ${code}`));
                }
            });

            ffmpeg.stderr.on('data', (data) => {
                console.error(`FFmpeg stderr: ${data}`);
            });

            ffmpeg.on('error', (err) => {
                console.error('Failed to start FFmpeg process.', err);
                reject(err);
            });
        });
    }
}

export default VideoService;
