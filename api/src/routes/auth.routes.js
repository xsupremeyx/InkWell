import { Router } from "express";

const authRouter = Router();

import { requireAuth } from "../middleware/requireAuth.js";
import { validateRegister, validateLogin, validateChangePassword } from "../validators/auth.validators.js";
import { validationError } from "../middleware/validationError.js";
import { registerUser, loginUser, getCurrentUser, changePassword } from "../controllers/auth.controller.js";
// routes

authRouter.patch("/change-password", requireAuth, validateChangePassword, validationError, changePassword);
authRouter.get("/me", requireAuth, getCurrentUser);
authRouter.post("/register", validateRegister, validationError, registerUser);
authRouter.post("/login", validateLogin, validationError, loginUser);

export default authRouter;