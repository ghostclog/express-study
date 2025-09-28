import { DataSource } from "typeorm";
// import userRouter from "./routes/user";      // 라우터 예시
// import productRouter from "./routes/product";
// import { authMiddleware } from "./middlewares/auth"; // 커스텀 미들웨어 예시
// import { loggerMiddleware } from "./middlewares/logger";
export { User } from "./tables/user";
export { Post } from "./tables/Post";
export { PostComment } from "./tables/PostComment";
export { Video } from "./tables/Video";
export { UserProfile } from "./tables/UserProfile";

import { User } from "./tables/user";
import { UserProfile } from "./tables/UserProfile";
import { Post } from "./tables/Post";
import { PostComment } from "./tables/PostComment";
import { Video } from "./tables/Video";


// ---------- DB 연결 (선택) ----------
export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, UserProfile,Post,PostComment, Video],
  migrations: [],
  subscribers: [],
});
