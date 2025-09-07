import { DataSource } from "typeorm";
// import userRouter from "./routes/user";      // 라우터 예시
// import productRouter from "./routes/product";
// import { authMiddleware } from "./middlewares/auth"; // 커스텀 미들웨어 예시
// import { loggerMiddleware } from "./middlewares/logger";
import { User,Post,PostComment,UserProfile } from ".././setting/tables";

// ---------- DB 연결 (선택) ----------
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User,Post,PostComment,UserProfile],
    migrations: [],
    subscribers: [],
  });

