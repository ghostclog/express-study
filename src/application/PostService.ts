import PostOrmRepo from '../database/orm_modules/post_orm_repo';
import { PostEn, CommentEn } from './../domain/Post';

const postRepo = new PostOrmRepo();

class PostServiceClass {
    async createPost(post:PostEn, writerId: number){
        const result = await postRepo.createPost(post, writerId);
        return result;
    }

    async getAllPosts(){
        const result = await postRepo.getAllPosts();
        return result;
    }
    
    async getPostById(postId: number){
        const result = await postRepo.getPostById(postId);
        return result;
    }

    async updatePost(postId: number, postData: Partial<PostEn>){
        const result = await postRepo.updatePost(postId, postData);
        return result;
    }
}

export default PostServiceClass;