// routes/index.js
import express from "express";
import authRoutes from "./userRoutes.js";
import postRoutes from "./postRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);

export default router;
