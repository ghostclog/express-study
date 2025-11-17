import { Router } from "express";
import passport from "passport";

import type UserService from "../application/UserService";
import {MeddlewareNeedLogin} from "../settings/security"

export function createUserRouter(userService: UserService) {
  const router = Router();

  router.get("/user/:user_id", async (req, res) => {
    const userId = parseInt(req.params.user_id, 10);
    const user = await userService.getUserById(userId);
    res.json(user);
  });

  router.get("/regist", (req, res) => {res.render("regist");});

  router.post("/regist", async (req, res) => {
    const email = req.body.email
    const not_hashed_password = req.body.password
    const name = req.body.name
    const user = await userService.createUser(email,not_hashed_password,name);
    res.redirect("/users/login");
  });

  router.get("/login", (req, res) => {
    const messages = req.flash('error');
    const errorMessage = messages.length > 0 ? messages[0] : null;
    res.render("login", { error: errorMessage });
  });

  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/users/login",
      failureFlash: true,
    })
  );

  router.post("/logout", MeddlewareNeedLogin, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/users/login");
    });
  });

  router.post("/report/user/:user_id", MeddlewareNeedLogin, async (req, res, next) => {
    try {
      const reportedUserId = parseInt(req.params.user_id, 10);
      const { reason } = req.body;
      const reporterId = req.user?.id;

      if (!reporterId) {
        return res.status(401).send("로그인이 필요합니다.");
      }
      if (!reason) {
          return res.status(400).send("신고 사유가 필요합니다.");
      }

      await userService.reportUser(reportedUserId, reason, reporterId);
      res.status(201).json({ message: '신고가 접수되었습니다.' });
    } catch (error) {
      next(error);
    }
  });

  router.post("/report/user-chat/:user_id", MeddlewareNeedLogin, async (req, res, next) => {
    try {
      const reportedUserId = parseInt(req.params.user_id, 10);
      const { chat_text } = req.body;
      const reporterId = req.user?.id;

      if (!reporterId) {
        return res.status(401).send("로그인이 필요합니다.");
      }
      if (!chat_text) {
          return res.status(400).send("신고할 채팅 내용이 필요합니다.");
      }

      await userService.reportUser(reportedUserId, chat_text, reporterId);
      res.status(201).json({ message: '채팅 내용이 신고되었습니다.' });
    } catch (error) {
      next(error);
    }
  });

  // 기존 report 라우트는 삭제합니다.
  /*
  router.post("/report/:user_id", MeddlewareNeedLogin, async (req, res, next) => {
    const userId = parseInt(req.params.user_id, 10);
    const user = await userService.getUserById(userId);
    const chat_text = req.body.chat_text;
    const reporterId = req.user?.id;
    await userService.reportUser(userId, chat_text, reporterId);
    res.redirect("/");
  });
  */

  return router;
}
