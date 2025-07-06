import express from "express";
import { createPost} from "../controllers/postController.js";
import { upload} from "../middleware/upload.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// router.get("/", getAllPosts);
router.post("/", protect, upload.single("image"), createPost);

export default router;
