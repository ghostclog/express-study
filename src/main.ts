import express from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import { AppDataSource } from "./database/setting/config"
import {createUserRouter} from "./adapter/user_route";

import UserServiceClass from "./application/UserService";
import {passport_strategy} from "./settings/security"

const app = express();
const port = 3000;


AppDataSource.initialize()

// ---------- 템플릿 엔진 설정 ----------
app.set("view engine", "ejs");
app.set("views", "./src/views");

// ---------- 공통 미들웨어 ----------
app.use(express.static('public')); // 'public' 디렉토리를 정적 파일 제공 폴더로 설정
app.use(express.json()); // JSON Body 파싱
app.use(express.urlencoded({ extended: true })); // Form data 파싱
// app.use(loggerMiddleware); // 로깅 미들웨어

// ---------- 세션 & Passport ----------
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1시간
  })
);

passport.use(
  passport_strategy
);
app.use(passport.initialize());
app.use(passport.session());

// ---------- 라우터에 주입할 의존성 생성 ----------
const user_service = new UserServiceClass()

// ---------- 라우터 연결 ----------
app.use("/users", createUserRouter(user_service));       // 인증 필요
// app.use("/products", productRouter);                 // 인증 선택적

// ---------- 서버 시작 ----------
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
