import bcrypt from "bcrypt";

import UserOrmRepo from '../database/orm_modules/user_orm_repo';
import { UserEn } from './../domain/User';
import { UserReport } from "../database/setting/tables/UserETC";

const salt = 10;
const userRepo = new UserOrmRepo();

class UserServiceClass {
    async getUserByEmail(email: string): Promise<UserEn | null> {
        const result = await userRepo.getUserByEmail(email);
        return result
    }

    async getUserById(userId: number): Promise<UserEn | null> {
        const result = await userRepo.getUserById(userId);
        return result
    }

    async createUser(email: string, not_hashed_password: string, name:string|null): Promise<UserEn | null> {
        // 비밀번호 해싱
        const hashed_password = await bcrypt.hash(not_hashed_password, salt);

        // 객체 생성
        const user = new UserEn();
        user.email = email;
        user.password = hashed_password;
        if (name == undefined){user.name = "신입"}
        else{user.name = name;}
        

        // DB 저장 같은 게 있다면 여기서
        await userRepo.createUser(user);

        return user;
    }

    async reportUser(userId: number, reason: string, reporterId: number): Promise<void> {
        // 비밀번호 해싱

        // 객체 생성
        const userReport = new UserReport();
        userReport.report_text = reason;
        userReport.reported_user_id = userId;
        userReport.reporter_id = reporterId;

        // DB 저장 같은 게 있다면 여기서
        await userRepo.createUserReport(userReport);

    }

    async getAllReports(): Promise<UserReport[]> {
        return await userRepo.getAllReports();
    }

    async banUser(userId: number, banDurationDays: number): Promise<void> {
        const bannedUntil = new Date();
        bannedUntil.setDate(bannedUntil.getDate() + banDurationDays);
        await userRepo.updateUserBan(userId, bannedUntil);
    }
}


export default UserServiceClass;