import express from "express";
import multer from "multer";
import {
	createPost,
	votePost,
	commentOnPost,
	getPosts,
	// getUserProfileWithPosts,
} from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/createpost", protect, upload.array("images", 10), createPost);
router.post("/vote/:postId", protect, votePost);
router.post("/comment/:postId", protect, commentOnPost);
router.get("/", getPosts);

export default router;
