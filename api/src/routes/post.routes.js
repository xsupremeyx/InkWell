import { Router } from "express";

const postRouter = Router();

import { requireAuth } from "../middleware/requireAuth.js";
import { requireAuthor } from "../middleware/requireAuthor.js";
import { validationError } from "../middleware/validationError.js";
import { createPostValidator, updatePostValidator, postIdParamValidator } from "../validators/post.validators.js";
import { createPost } from "../controllers/post.controller.js";
// routes

postRouter.post("/", requireAuth, requireAuthor, createPostValidator, validationError, createPost);

export default postRouter;