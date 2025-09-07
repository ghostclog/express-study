
import { UserProfile } from '../setting/tables/UserProfile';
import { UserEn } from './../../domain/User';
import { AppDataSource, User } from "./../setting/config"; // main에서 import하지 말고 data-source.ts에서 import!

class UserOrmRepo {
    private userRepo = AppDataSource.getRepository(User);
    private userProfileRepo = AppDataSource.getRepository(UserProfile);

    async getUserById(id: number): Promise<UserEn | null> {
        const user_entity = await this.userRepo.findOne({
            where: { id },
            relations: ["profile", "posts", "postComments"],
        });
        if (!user_entity) return null;

        const userEn = new UserEn();
        userEn.id = user_entity.id;
        userEn.name = user_entity.name ?? "";
        userEn.createdAt = user_entity.createdAt;
        userEn.count_post = user_entity.posts ? user_entity.posts.length : 0;
        userEn.count_comment = user_entity.postComments ? user_entity.postComments.length : 0;
        let user_profile = user_entity.profile;
        if (user_profile) {
            userEn.comment = user_profile.comment;
            userEn.profile_image = user_profile.profile_image;
        }
        return userEn;
    }

    async getUserByEmail(email: string): Promise<UserEn | null> {
        const user_entity = await this.userRepo.findOne({
            where: { email },
            relations: ["profile", "posts", "postComments"],
        });
        if (!user_entity) return null;

        const userEn = new UserEn();
        userEn.id = user_entity.id;
        userEn.name = user_entity.name ?? "";
        userEn.createdAt = user_entity.createdAt;
        userEn.count_post = user_entity.posts ? user_entity.posts.length : 0;
        userEn.count_comment = user_entity.postComments ? user_entity.postComments.length : 0;
        let user_profile = user_entity.profile;
        if (user_profile) {
            userEn.comment = user_profile.comment;
            userEn.profile_image = user_profile.profile_image;
        }
        return userEn;
    }
}

export default UserOrmRepo;