import bcrypt from "bcrypt";

import UserOrmRepo from '../database/orm_modules/user_orm_repo';
import { UserEn } from './../domain/User';
import { UserReport } from "../database/setting/tables/UserETC";
import chatCache from "./ChatCache";

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

    async reportUser(userId: number, reason: string, reporterId: number, roomId?: string): Promise<void> {
        let fullReportText = `신고 사유: ${reason}`;

        if (roomId) {
            const chatHistory = chatCache.get<string>(roomId);
            if (chatHistory) {
                // 더 이상 배열을 변환할 필요 없이, 저장된 문자열을 그대로 사용
                fullReportText += `\n\n--- 최근 채팅 내역 ---\n${chatHistory}`;
            }
        }
        
        const userReport = new UserReport();
        userReport.report_text = fullReportText;
        userReport.reported_user_id = userId;
        userReport.reporter_id = reporterId;

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