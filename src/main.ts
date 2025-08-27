import express from "express";
import session from "express-session";
import passport from "passport";
import { DataSource } from "typeorm";
// import userRouter from "./routes/user";      // 라우터 예시
// import productRouter from "./routes/product";
// import { authMiddleware } from "./middlewares/auth"; // 커스텀 미들웨어 예시
// import { loggerMiddleware } from "./middlewares/logger";
import { User } from "./adapter/db/setting/database";

const app = express();
const port = 3000;

// ---------- DB 연결 (선택) ----------
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
  });
// ---------- 공통 미들웨어 ----------
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

app.use(passport.initialize());
app.use(passport.session());

// ---------- 라우터 연결 ----------
// app.use("/users", authMiddleware, userRouter);       // 인증 필요
// app.use("/products", productRouter);                 // 인증 선택적

// ---------- 기본 라우트 ----------
app.get("/", (req, res) => {
  res.send("Hello, Express + TS!");
});

// ---------- 서버 시작 ----------
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
