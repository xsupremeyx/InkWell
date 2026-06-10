import express from "express";

const app = express();
app.use(express.json());

import authRouter from "./routes/auth.routes.js"
import postRouter from "./routes/post.routes.js";

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
    res.status(200).json({ message: "InkWell API is healthy" });
})

export { app };