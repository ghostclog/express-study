import express from "express";
import session from "express-session";
import passport from "passport";
import { AppDataSource } from "./database/setting/config"

const app = express();
const port = 3000;

AppDataSource.initialize()

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
