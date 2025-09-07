import passport from "passport";
import bcrypt from "bcrypt";

import { Strategy as LocalStrategy } from "passport-local";
import UserOrmRepo from "../database/orm_modules/user_orm_repo";

const userRepo = new UserOrmRepo();
export const passport_strategy =new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await userRepo.getUserByEmail(email); // 이 메서드 추가 필요
      if (!user) return done(null, false, { message: "email is not exist" });
      if (!user.password) return done(null, false, { message: "user data error" });
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return done(null, false, { message: "Wrong password" });
      return done(null, user);
    }
  )

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  const userRepo = new (await import("../database/orm_modules/user_orm_repo")).default();
  const user = await userRepo.getUserById(id);
  done(null, user);
});