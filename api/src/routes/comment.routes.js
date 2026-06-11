import { Router } from "express";

const commentRouter = Router();

// middle ware imports
import { requireAuth } from "../middleware/requireAuth.js";
import { validationError } from "../middleware/validationError.js";

// validators imports
import { commentContentValidator, commentIdParamValidator } from "../validators/comment.validators.js";

// controllers imports
import { updateComment, deleteComment } from "../controllers/comment.controller.js";

// routes
commentRouter.put("/:id", requireAuth, commentIdParamValidator, commentContentValidator, validationError, updateComment);
commentRouter.delete("/:id", requireAuth, commentIdParamValidator, validationError, deleteComment);

export default commentRouter;