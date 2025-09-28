import express, { Router } from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import flash from "connect-flash";
import http from 'http';
import { Server } from 'socket.io';

import { AppDataSource } from "./database/setting/config"
import {passport_strategy} from "./settings/security"
import initializeSocket from './socket_handler';

import { createUserRouter } from "./adapter/user_route";
import { createStreamRouter } from "./adapter/stream_router";
import { createPostRouter } from "./adapter/post_router";

import PostServiceClass from "./application/PostService";
import UserServiceClass from "./application/UserService";
import CommentServiceClass from "./application/CommentService";
import VideoService from './application/VideoService';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;


AppDataSource.initialize()

// ---------- 템플릿 엔진 설정 ----------
app.set("view engine", "ejs");
app.set("views", "./src/views");

// ---------- 공통 미들웨어 ----------
// '/static' URL 경로를 'src/static' 실제 폴더에 연결합니다.
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/uploads', express.static('uploads'));
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
app.use(flash())
passport.use(
  passport_strategy
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// ---------- 라우터에 주입할 의존성 생성 ----------
const user_service = new UserServiceClass()
const post_service = new PostServiceClass()
const comment_service = new CommentServiceClass()
const video_service = new VideoService();

// ---------- Socket.IO 설정 ----------
initializeSocket(io);

// ---------- 라우터 연결 ----------
const main_router = Router();
main_router.get("/",(req,res)=>{
  res.render("home");
});
app.use("/",main_router);
app.use("/users", createUserRouter(user_service));       // 인증 필요
app.use("/stream", createStreamRouter());
app.use("/post", createPostRouter(post_service, comment_service, video_service));
// app.use("/products", productRouter);                 // 인증 선택적

// ---------- 서버 시작 ----------
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
