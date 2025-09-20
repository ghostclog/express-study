import { Router } from "express";
import passport from "passport";

import PostService from "../application/PostService";
import { MeddlewareNeedLogin } from "../settings/security";
import { PostEn } from "../domain/Post";

export function createPostRouter(postService: PostService) {
  const router = Router();

  // 1. EJS 페이지 렌더링 라우트
  // 1-1. 게시글 목록 페이지
  router.get("/posts", (req, res) => {
    res.render("post_list");
  });

  // 1-2. 게시글 상세 페이지
  router.get("/posts/:post_id", async (req, res) => {
    const postId = parseInt(req.params.post_id, 10);
    const post = await postService.getPostById(postId);
    res.render("post_detail", { post: post });
  });

  // 2. API 라우트 (JSON 반환)
  // 2-1. 전체 게시글 목록 데이터
  router.get("/api/posts", async (req, res) => {
    const result = await postService.getAllPosts();
    res.json(result);
  });

  // 2-2. 게시글 생성
  router.post("/api/posts", MeddlewareNeedLogin, async (req, res) => {
    if (!req.user) {
      return res.status(401).send("User not found after login middleware.");
    }
    const post = req.body;
    const writerId = req.user.id;
    const result = await postService.createPost(post, writerId);
    res.status(201).json(result);
  });

  return router;
}

export default createPostRouter;