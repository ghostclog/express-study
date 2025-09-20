import { UserEn } from "../../domain/User";

declare global {
  namespace Express {
    // passport에 의해 추가되는 user 객체에 대한 타입 정의
    export interface User extends UserEn {}

    export interface Request {
      user?: User;
    }
  }
}
