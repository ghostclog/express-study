import { Router } from "express";

export function createStreamRouter() {
  const router = Router();

  router.get("/stream", (req, res) => {
    res.render("stream");
  });

  return router;
}
