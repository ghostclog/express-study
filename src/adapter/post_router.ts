import { Router } from "express";
import passport from "passport";

import PostService from "../application/PostService";
import CommentService from "../application/CommentService";
import VideoService from "../application/VideoService";
import { MeddlewareNeedLogin } from "../settings/security";
import { PostEn, PostType, CommentEn } from "../domain/Post";
import upload from "../settings/multer_config";
import { checkOwnership, loadPost, loadComment } from "./middleware";

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

  router.get("/posts/:post_id", loadPost(), async (req, res) => {
    res.render("post_detail", { post: req.post, postTypeDisplayNames });
  });

  router.get("/posts/:post_id/edit", MeddlewareNeedLogin, loadPost(), checkOwnership(req => req.post?.writer), async (req, res) => {
    res.render("post_form", {
        mode: 'edit',
        post: req.post,
        postTypes: PostType
    });
  });

  router.get('/watch/:post_id', MeddlewareNeedLogin, loadPost(), async (req, res) => {
    const post = req.post!;

    if (post.post_type !== 'video_share' || !post.video) {
        return res.status(404).send("영상을 찾을 수 없거나 공유 가능한 영상이 아닙니다.");
    }
    
    // Check if the current user is the author
    const isHost = req.user && post.writer && req.user.id === post.writer.id;

    const watchUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    res.render('watch_room', { post, isHost, watchUrl, user: req.user });
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

  router.post("/api/posts/:post_id/upload", MeddlewareNeedLogin, loadPost(), checkOwnership(req => req.post?.writer), upload.single('video'), async (req, res) => {
    const postId = req.post!.id;

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

  router.put("/api/posts/:post_id", MeddlewareNeedLogin, loadPost(), checkOwnership(req => req.post?.writer), async (req, res) => {
    const postId = req.post!.id;
    const postData: Partial<PostEn> = req.body;
    
    const result = await postService.updatePost(postId, postData);
    res.json(result);
  });

  router.post("/api/posts/:post_id/clips", MeddlewareNeedLogin, loadPost(), async (req, res) => {
    const postId = req.post!.id;
    const { title, startTime, endTime } = req.body;

    if (!title || startTime === undefined || endTime === undefined) {
      return res.status(400).send("Title, startTime, and endTime are required.");
    }

    try {
      const clipPath = await videoService.createClip(postId, startTime, endTime, title);
      res.status(201).json({ message: "Clip created successfully", clipPath });
    } catch (error) {
      console.error("Failed to create clip:", error);
      res.status(500).send("Failed to create clip.");
    }
  });
  router.delete("/api/posts/:post_id", MeddlewareNeedLogin, loadPost(), checkOwnership(req => req.post?.writer), async (req, res) => {
    const postId = req.post!.id;
    await postService.deletePost(postId);
    res.status(204).send();
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

  router.put("/api/comments/:comment_id", MeddlewareNeedLogin, loadComment(), checkOwnership(req => req.comment?.writer), async (req, res) => {
    const commentId = req.comment!.id;
    const { contents } = req.body;

    const result = await commentService.updateComment(commentId, contents);
    res.json(result);
  });

  router.delete("/api/comments/:comment_id", MeddlewareNeedLogin, loadComment(), checkOwnership(req => req.comment?.writer), async (req, res) => {
    const commentId = req.comment!.id;
      
    await commentService.deleteComment(commentId);
    res.status(204).send();
  });

  return router;
}

export default createPostRouter;