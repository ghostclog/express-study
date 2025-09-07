import UserOrmRepo from '../database/orm_modules/user_orm_repo';

const userRepo = new UserOrmRepo();

class UserServiceClass {
    getUserById(userId: number) {
        return userRepo.getUserById(userId);
    }
}


export default UserServiceClass;