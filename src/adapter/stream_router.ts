import { Router } from "express";

export function createStreamRouter() {
  const router = Router();

  router.get("/stream_home", (req, res) => {
    res.render("stream_home");
  });

  return router;
}
