import express from "express";

const app = express();
app.use(express.json());

import authRouter from "./routes/auth.routes.js"

app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
    res.status(200).json({ message: "InkWell API is healthy" });
})

export { app };