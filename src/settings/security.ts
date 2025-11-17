import passport from "passport";
import bcrypt from "bcrypt";

import { Strategy as LocalStrategy } from "passport-local";
import UserServiceClass from "../application/UserService";
import { NextFunction, Request, Response } from "express";

const userService = new UserServiceClass();
export const passport_strategy =new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await userService.getUserByEmail(email); // 이 메서드 추가 필요
      if (!user) return done(null, false, { message: "계정이 존재하지 않습니다." });
      if (!user.password) return done(null, false, { message: "유저 정보에 에러가 존재합니다. 고객센터로 문의를 남겨주세요." });
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return done(null, false, { message: "비밀번호가 일치하지 않습니다. 다시 입력해주세요." });
      return done(null, user);
    }
  )

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  const user = await userService.getUserById(id);
  done(null, user);
});

export function MeddlewareNeedLogin(req:Request, res:Response, next:NextFunction) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next(); // 인증되어 있으면 다음 미들웨어(혹은 라우트 핸들러) 실행
  }
  res.redirect("/users/login"); // 인증 안 되었으면 로그인 페이지로
}