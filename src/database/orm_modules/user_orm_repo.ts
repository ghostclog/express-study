
import { UserProfile } from '../setting/tables/UserProfile';
import { UserReport } from '../setting/tables/UserETC';
import { UserEn } from './../../domain/User';
import { AppDataSource, User } from "./../setting/config"; // main에서 import하지 말고 data-source.ts에서 import!

class UserOrmRepo {
    private userRepo = AppDataSource.getRepository(User);
    private userProfileRepo = AppDataSource.getRepository(UserProfile);
    private userReportRepo = AppDataSource.getRepository(UserReport);
    
    private toUserEn(user_entity: User): UserEn {
        const userEn = new UserEn();
        userEn.id = user_entity.id;
        userEn.email = user_entity.email;
        userEn.password = user_entity.password;
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

    //C
    async createUser(user:UserEn){
        const userEntity = this.userRepo.create({
            email: user.email,
            password: user.password,
            name: user.name
        });

        // DB에 저장
        await this.userRepo.save(userEntity);
    }

    //C
    async createUserReport(userReport: UserReport): Promise<UserReport> {
        const userReportEntity = this.userReportRepo.create({
            report_text: userReport.report_text,
            reported_user_id: userReport.reported_user_id,
            reporter_id: userReport.reporter_id
        });
        await this.userReportRepo.save(userReportEntity);
        return userReportEntity;
    }

    //R
    async getUserById(id: number): Promise<UserEn | null> {
        const user_entity = await this.userRepo.findOne({
            where: { id },
            relations: ["profile", "posts", "postComments"],
        });
        if (!user_entity) return null;

        return this.toUserEn(user_entity);
    }

    async getUserByEmail(email: string): Promise<UserEn | null> {
        const user_entity = await this.userRepo.findOne({
            where: { email },
            relations: ["profile", "posts", "postComments"],
        });
        if (!user_entity) return null;

        return this.toUserEn(user_entity);
    }

    async getAllReports(): Promise<UserReport[]> {
        return this.userReportRepo.find();
    }

    //U
    async updateUserBan(userId: number, bannedUntil: Date): Promise<void> {
        await this.userRepo.update(userId, { banned_at: bannedUntil });
    }

    //D



}

export default UserOrmRepo;