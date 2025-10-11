import { Request, Response, NextFunction } from 'express';
import PostService from '../application/PostService';
import CommentService from '../application/CommentService';
import { PostEn, CommentEn } from '../domain/Post';

// Request 객체를 확장하여 엔티티를 추가
declare global {
  namespace Express {
    interface Request {
      post?: PostEn;
      comment?: CommentEn;
    }
  }
}

// writer 속성을 가진 모든 엔티티에 대한 인터페이스
interface Ownable {
  writer?: {
    id: number;
  } | null;
}

/**
 * post_id 파라미터에서 Post 엔티티를 로드하여 req.post에 attach하는 미들웨어
 */
export const loadPost = (postService: PostService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = parseInt(req.params.post_id, 10);
      
      if (isNaN(postId)) {
        return res.status(400).send("유효하지 않은 게시글 ID입니다.");
      }

      const post = await postService.getPostById(postId);

      if (!post) {
        return res.status(404).send("게시글을 찾을 수 없습니다.");
      }

      req.post = post;
      next();
    } catch (error) {
      console.error("Load post middleware error:", error);
      return res.status(500).send("서버 내부 오류가 발생했습니다.");
    }
  };
};

/**
 * comment_id 파라미터에서 Comment 엔티티를 로드하여 req.comment에 attach하는 미들웨어
 */
export const loadComment = (commentService: CommentService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commentId = parseInt(req.params.comment_id, 10);
      
      if (isNaN(commentId)) {
        return res.status(400).send("유효하지 않은 댓글 ID입니다.");
      }

      const comment = await commentService.getCommentById(commentId);

      if (!comment) {
        return res.status(404).send("댓글을 찾을 수 없습니다.");
      }

      req.comment = comment;
      next();
    } catch (error) {
      console.error("Load comment middleware error:", error);
      return res.status(500).send("서버 내부 오류가 발생했습니다.");
    }
  };
};

/**
 * req에 attach된 엔티티의 소유권을 확인하는 미들웨어
 * @param entityKey req 객체에서 확인할 엔티티의 키 (예: 'post', 'comment')
 */
export const checkOwnership = (entityKey: 'post' | 'comment') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Passport를 통해 req.user가 설정되었는지 확인
    if (!req.user) {
      return res.status(401).send("로그인이 필요합니다.");
    }

    try {
      const entity = req[entityKey] as Ownable | undefined;

      if (!entity) {
        return res.status(404).send("요청한 항목을 찾을 수 없습니다.");
      }
      
      const userId = (req.user as any).id;

      if (!entity.writer || entity.writer.id !== userId) {
        return res.status(403).send("작업을 수행할 권한이 없습니다.");
      }

      // 소유권이 확인되면 다음 로직으로 진행
      next();
    } catch (error) {
      console.error("Ownership check middleware error:", error);
      return res.status(500).send("서버 내부 오류가 발생했습니다.");
    }
  };
};
