import express from "express";
import { createPost, getAllPosts } from "../controllers/postController.js";
import { upload, convertToWebp } from "../middleware/upload.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/", protect, upload.single("image"), convertToWebp, createPost);

export default router;
