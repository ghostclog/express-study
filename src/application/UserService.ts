import bcrypt from "bcrypt";

import UserOrmRepo from '../database/orm_modules/user_orm_repo';
import { UserEn } from './../domain/User';

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
}


export default UserServiceClass;