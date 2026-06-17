import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

app.use(cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    credentials: true,
}))

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { errors: [{ field: 'rateLimit', message: 'Too many requests, please try again later.' }] }
});

const readLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
});

import authRouter from "./routes/auth.routes.js"
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comment.routes.js";

app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/posts", readLimiter, postRouter);
app.use("/api/v1/auth", authLimiter, authRouter);

app.get("/", (req, res) => {
    res.status(200).json({ message: "InkWell API is healthy" });
})

app.use(notFound);
app.use(errorHandler);

export { app };