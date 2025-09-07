import { Router } from "express";
import path from "path";

import type UserService from "../application/UserService";

export function createUserRouter(userService: UserService) {
  const router = Router();

  router.get("/user/:user_id", async (req, res) => {
    const userId = parseInt(req.params.user_id, 10);
    const user = await userService.getUserById(userId);
    res.json(user);
  });

  router.get("/regist", (req, res) => {
    res.render("regist"); // views/regist.ejs를 찾아서 렌더링
  });

  router.post("/regist", async (req, res) => {
    const email = req.body.email
    const not_hashed_password = req.body.password
    const name = req.body.name
    const user = await userService.createUser(email,not_hashed_password,name);
    res.json(user);
  });

  return router;
}
