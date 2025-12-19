import { Router } from "express";
import passport from "passport";

import type UserService from "../application/UserService";
import PostService from "../application/PostService"; // PostService import 추가
import {MeddlewareNeedLogin} from "../settings/security"

export function createUserRouter(userService: UserService) {
  const router = Router();
  const postService = new PostService(); // PostService 인스턴스 생성

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

  router.get("/admin", MeddlewareNeedLogin, async (req, res) => {
    if (req.user && req.user.permission_level > 0) { // 어드민 권한 체크 (실제로는 더 엄격해야 함)
      const userReports = await userService.getAllReports();
      const postReports = await postService.getAllPostReports(); // 게시글 신고 목록 가져오기
      res.render("admin", { 
        user: req.user, 
        reports: userReports, // 변수명 일관성을 위해 userReports -> reports로 변경
        postReports: postReports // 템플릿에 전달
      });
    } else {
      res.status(403).send("접근 권한이 없습니다.");
    }
  });

  router.post("/users/ban/:user_id", MeddlewareNeedLogin, async (req, res, next) => {
    try {
      if (!req.user || req.user.permission_level <= 0) {
        return res.status(403).send("접근 권한이 없습니다.");
      }
      const userIdToBan = parseInt(req.params.user_id, 10);
      const { ban_duration_days } = req.body;

      if (!ban_duration_days || isNaN(parseInt(ban_duration_days, 10))) {
        return res.status(400).send("제재 기간을 정확히 입력해주세요.");
      }

      await userService.banUser(userIdToBan, parseInt(ban_duration_days, 10));
      res.status(200).json({ message: `사용자(ID: ${userIdToBan})가 ${ban_duration_days}일간 제재되었습니다.` });
    } catch (error) {
      next(error);
    }
  });

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
      const { reason, roomId } = req.body;
      const reporterId = req.user?.id;

      if (!reporterId) {
        return res.status(401).send("로그인이 필요합니다.");
      }
      if (!reason || !roomId) {
          return res.status(400).send("신고 사유와 채팅방 정보가 필요합니다.");
      }

      await userService.reportUser(reportedUserId, reason, reporterId, roomId);
      res.status(201).json({ message: '채팅 내용이 신고되었습니다.' });
    } catch (error) {
      next(error);
    }
  });

  router.post("/block/:user_id", MeddlewareNeedLogin, async (req, res, next) => {
      try {
          const targetId = parseInt(req.params.user_id, 10);
          const ownerId = req.user?.id;

          if (!ownerId) {
              return res.status(401).send("로그인이 필요합니다.");
          }

          if (ownerId === targetId) {
              return res.status(400).send("자기 자신을 차단할 수 없습니다.");
          }

          await userService.addToBlackList(ownerId, targetId);
          res.status(201).json({ message: '사용자를 차단했습니다.' });
      } catch (error) {
          next(error);
      }
  });

  return router;
}
