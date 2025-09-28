import { Router } from "express";
import passport from "passport";

import PostService from "../application/PostService";
import CommentService from "../application/CommentService";
import VideoService from "../application/VideoService";
import { MeddlewareNeedLogin } from "../settings/security";
import { PostEn, PostType, CommentEn } from "../domain/Post";
import upload from "../settings/multer_config";

export function createPostRouter(postService: PostService, commentService: CommentService, videoService: VideoService) {
  const router = Router();

  const postTypeDisplayNames = {
    [PostType.COMMON]: '일반',
    [PostType.VIDEO_SHARE]: '영상 공유'
  };

  // 1. EJS 페이지 렌더링 라우트
  router.get("/posts", (req, res) => {
    res.render("post_list", { postTypeDisplayNames });
  });

  router.get("/posts/new", MeddlewareNeedLogin, (req, res) => {
    res.render("post_form", {
      mode: 'create',
      post: null,
      postTypes: PostType
    });
  });

  router.get("/posts/:post_id", async (req, res) => {
    const postId = parseInt(req.params.post_id, 10);
    const post = await postService.getPostById(postId);
    res.render("post_detail", { post: post, postTypeDisplayNames });
  });

  router.get("/posts/:post_id/upload", MeddlewareNeedLogin, async (req, res) => {
    const postId = parseInt(req.params.post_id, 10);
    const post = await postService.getPostById(postId);

    if (!post || (req.user && post.writer && req.user.id !== post.writer.id)) {
      return res.status(403).send("업로드 권한이 없습니다.");
    }
    res.render("video_upload_form", { post });
  });

  router.get("/posts/:post_id/edit", MeddlewareNeedLogin, async (req, res) => {
    const postId = parseInt(req.params.post_id, 10);
    const post = await postService.getPostById(postId);
    
    if (!post || (req.user && post.writer && req.user.id !== post.writer.id)) {
        return res.status(403).send("수정 권한이 없습니다.");
    }
      
    res.render("post_form", {
        mode: 'edit',
        post: post,
        postTypes: PostType
    });
  });

  // 2. API 라우트 (JSON 반환)
  router.get("/api/posts", async (req, res) => {
    const result = await postService.getAllPosts();
    res.json(result);
  });

  router.post("/api/posts", MeddlewareNeedLogin, async (req, res) => {
    if (!req.user) {
      return res.status(401).send("User not found after login middleware.");
    }
    const post = req.body;
    const writerId = req.user.id;
    const result = await postService.createPost(post, writerId);
    res.status(201).json(result);
  });

  router.post("/api/posts/:post_id/upload", MeddlewareNeedLogin, upload.single('video'), async (req, res) => {
    const postId = parseInt(req.params.post_id, 10);

    const post = await postService.getPostById(postId);
    if (!post || (req.user && post.writer && req.user.id !== post.writer.id)) {
        return res.status(403).send("업로드 권한이 없습니다.");
    }

    if (!req.file) {
      return res.status(400).send("영상 파일이 필요합니다.");
    }

    try {
      await videoService.saveVideo(req.file, postId);
      res.status(200).json({ message: "영상 업로드 성공" });
    } catch (error) {
      console.error(error);
      res.status(500).send("영상 업로드 중 오류가 발생했습니다.");
    }
  });

  router.put("/api/posts/:post_id", MeddlewareNeedLogin, async (req, res) => {
    const postId = parseInt(req.params.post_id, 10);
    const postData: Partial<PostEn> = req.body;
    
    // Check ownership before updating
    const post = await postService.getPostById(postId);
    if (!post || (req.user && post.writer && req.user.id !== post.writer.id)) {
        return res.status(403).send("수정 권한이 없습니다.");
    }

    const result = await postService.updatePost(postId, postData);
    res.json(result);
  });

  // 3. Comment API Routes
  router.get("/api/posts/:post_id/comments", async (req, res) => {
    const postId = parseInt(req.params.post_id, 10);
    const comments = await commentService.getCommentsByPostId(postId);
    res.json(comments);
  });

  router.post("/api/posts/:post_id/comments", MeddlewareNeedLogin, async (req, res) => {
    if (!req.user) {
      return res.status(401).send("User not found after login middleware.");
    }
    const postId = parseInt(req.params.post_id, 10);
    const { contents } = req.body;
    
    const newComment = new CommentEn();
    newComment.contents = contents;
    newComment.post_id = postId;

    const result = await commentService.createComment(newComment, req.user.id);
    res.status(201).json(result);
  });

  router.put("/api/comments/:comment_id", MeddlewareNeedLogin, async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    const commentId = parseInt(req.params.comment_id, 10);
    const { contents } = req.body;

    const comment = await commentService.getCommentById(commentId);
    if (!comment || comment.writer.id !== req.user.id) {
        return res.status(403).send("수정 권한이 없습니다.");
    }

    const result = await commentService.updateComment(commentId, contents);
    res.json(result);
  });

  router.delete("/api/comments/:comment_id", MeddlewareNeedLogin, async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    const commentId = parseInt(req.params.comment_id, 10);
    
    const comment = await commentService.getCommentById(commentId);
    if (!comment || comment.writer.id !== req.user.id) {
        return res.status(403).send("삭제 권한이 없습니다.");
    }
      
    await commentService.deleteComment(commentId);
    res.status(204).send();
  });

  return router;
}

export default createPostRouter;