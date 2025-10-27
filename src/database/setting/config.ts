import { DataSource } from "typeorm";
import "dotenv/config"; // .env 파일 로드를 위해 추가
// import userRouter from "./routes/user";      // 라우터 예시
// import productRouter from "./routes/product";
// import { authMiddleware } from "./middlewares/auth"; // 커스텀 미들웨어 예시
// import { loggerMiddleware } from "./middlewares/logger";
export { User } from "./tables/User";
export { Post } from "./tables/Post";
export { PostComment } from "./tables/PostComment";
export { Video } from "./tables/Video";
export { UserProfile } from "./tables/UserProfile";

import { User } from "./tables/User";
import { UserProfile } from "./tables/UserProfile";
import { Post } from "./tables/Post";
import { PostComment } from "./tables/PostComment";
import { Video } from "./tables/Video";


// ---------- DB 연결 ----------
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // 개발 환경에서는 true로 설정하여 자동 스키마 동기화를 사용합니다.
  logging: process.env.NODE_ENV === 'development', // 개발 환경에서만 로깅 활성화
  entities: [User, UserProfile, Post, PostComment, Video],
  migrations: ["src/database/migrations/*.ts"], // 마이그레이션 파일 경로
  subscribers: [],
});
