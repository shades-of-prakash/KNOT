import express from "express";
import {
	register,
	verifyOtp,
	login,
	getCurrentUser,
	getUserProfileWithPosts,
	uploadProfilePic,
} from "../controllers/userController.js";

import { upload } from "../middleware/upload.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);

router.get("/me/posts", protect, getUserProfileWithPosts);
router.get(
	"/update-profile",
	protect,
	upload.single("image"),
	uploadProfilePic
);

export default router;
