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

  return router;
}
