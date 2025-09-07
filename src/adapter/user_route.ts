import { Router } from "express";
import type UserService from "../application/UserService";

export function createUserRouter(userService: UserService) {
  const router = Router();

  router.get("/user/:user_id", async (req, res) => {
    const userId = parseInt(req.params.user_id, 10);
    const user = await userService.getUserById(userId);
    res.json(user);
  });

  return router;
}
