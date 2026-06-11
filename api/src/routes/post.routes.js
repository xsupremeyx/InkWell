import { Router } from "express";

const postRouter = Router();

// middle ware imports
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAuthor } from "../middleware/requireAuthor.js";

// validators imports
import { validationError } from "../middleware/validationError.js";
import { createPostValidator, updatePostValidator, postIdParamValidator } from "../validators/post.validators.js";
import { commentContentValidator } from "../validators/comment.validators.js";

// controllers imports
import { createPost, getPosts, getPostById, togglePublish, updatePost, deletePost } from "../controllers/post.controller.js";
import { getCommentsByPostId, createComment } from "../controllers/comment.controller.js";

// routes

// comment get and post routes
postRouter.get("/:id/comments", postIdParamValidator, validationError, getCommentsByPostId);
postRouter.post("/:id/comments", requireAuth, postIdParamValidator, commentContentValidator, validationError, createComment);

postRouter.patch("/:id/publish", requireAuth, requireAuthor, postIdParamValidator, validationError, togglePublish);
postRouter.put("/:id", requireAuth, requireAuthor, postIdParamValidator, updatePostValidator, validationError, updatePost);
postRouter.delete("/:id", requireAuth, requireAuthor, postIdParamValidator, validationError, deletePost);
postRouter.get("/:id", postIdParamValidator, validationError, getPostById);
postRouter.get("/", getPosts);
postRouter.post("/", requireAuth, requireAuthor, createPostValidator, validationError, createPost);

export default postRouter;