import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config"; // .env 파일 로드를 위해 추가
// import userRouter from "./routes/user";      // 라우터 예시
// import productRouter from "./routes/product";
// import { authMiddleware } from "./middlewares/auth"; // 커스텀 미들웨어 예시
// import { loggerMiddleware } from "./middlewares/logger";
import { User } from "./tables/User";
import { UserProfile } from "./tables/UserProfile";
import { Post } from "./tables/Post";
import { PostComment } from "./tables/PostComment";
import { Video } from "./tables/Video";
import { UserReport } from './tables/UserETC';
import { PostReport } from "./tables/PostReport"; // PostReport import 추가

export { User, UserProfile, Post, PostComment, Video, UserReport, PostReport }; // PostReport export 추가

// ---------- DB 연결 ----------
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME || '유저이름',
  password: process.env.DB_PASSWORD || '비밀번호',
  database: process.env.DB_DATABASE || 'node_study',
  synchronize: true, // 개발 환경에서는 true로 설정하여 자동 마이그레이션
  logging: true,
  entities: [User, UserProfile, Post, PostComment, Video, UserReport, PostReport], // entities 배열에 PostReport 추가
  migrations: [],
  subscribers: [],
});
