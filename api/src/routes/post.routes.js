import { Router } from "express";

const postRouter = Router();

import { requireAuth } from "../middleware/requireAuth.js";
import { requireAuthor } from "../middleware/requireAuthor.js";
import { validationError } from "../middleware/validationError.js";
import { createPostValidator, updatePostValidator, postIdParamValidator } from "../validators/post.validators.js";
import { createPost, getPosts, getPostById, togglePublish, updatePost, deletePost } from "../controllers/post.controller.js";
// routes

postRouter.patch("/:id/publish", requireAuth, requireAuthor, postIdParamValidator, validationError, togglePublish);
postRouter.put("/:id", requireAuth, requireAuthor, postIdParamValidator, updatePostValidator, validationError, updatePost);
postRouter.delete("/:id", requireAuth, requireAuthor, postIdParamValidator, validationError, deletePost);
postRouter.get("/:id", postIdParamValidator, validationError, getPostById);
postRouter.get("/", getPosts);
postRouter.post("/", requireAuth, requireAuthor, createPostValidator, validationError, createPost);

export default postRouter;