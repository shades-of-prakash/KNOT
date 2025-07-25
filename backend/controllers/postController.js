import { Post } from "../models/post.js";
// import { bucket } from "../config/firebase.js";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../config/supabaseClient.js";
import { User } from "../models/user.js";
import path from "path";
// // Create a new post with images
// export const createPost = async (req, res) => {
// 	const { content } = req.body;
// 	const userId = req.user?.id;
// 	const files = req.files || [];

// 	if (!content?.trim()) {
// 		return res.status(400).json({ error: "Content is required" });
// 	}

// 	try {
// 		const imageUrls = [];

// 		for (const file of files) {
// 			const webpBuffer = await sharp(file.buffer)
// 				.webp({ lossless: true })
// 				.toBuffer();

// 			const filename = `${Date.now()}-${uuidv4()}.webp`;
// 			const blob = bucket.file(filename);

// 			const blobStream = blob.createWriteStream({
// 				metadata: {
// 					contentType: "image/webp",
// 					metadata: {
// 						firebaseStorageDownloadTokens: uuidv4(),
// 					},
// 				},
// 			});

// 			await new Promise((resolve, reject) => {
// 				blobStream.on("error", reject);
// 				blobStream.on("finish", resolve);
// 				blobStream.end(webpBuffer);
// 			});

// 			const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
// 				bucket.name
// 			}/o/${encodeURIComponent(filename)}?alt=media`;

// 			imageUrls.push(publicUrl);
// 		}

// 		const post = await Post.create({
// 			user: userId,
// 			content,
// 			images: imageUrls,
// 		});

// 		res.status(201).json({ message: "Post created", post });
// 	} catch (err) {
// 		console.error("Create post error:", err);
// 		res.status(500).json({ error: "Server error" });
// 	}
// };

export const createPost = async (req, res) => {
	const { content } = req.body;
	const userId = req.user?.id;
	const files = req.files || [];

	if (!content?.trim()) {
		return res.status(400).json({ error: "Content is required" });
	}

	try {
		const user = await User.findById(userId).lean();
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const username =
			user.username?.replace(/\s+/g, "_").toLowerCase() || "user";
		const folderName = `posts/${userId}_${username}`;

		const imageUrls = [];

		for (const file of files) {
			const ext = path.extname(file.originalname) || ".jpg";
			const filename = `${Date.now()}-${uuidv4()}${ext}`;
			const filePath = `${folderName}/${filename}`;

			const { data: uploadData, error: uploadError } = await supabase.storage
				.from("knot")
				.upload(filePath, file.buffer, {
					contentType: file.mimetype,
					upsert: true,
				});

			if (uploadError) {
				console.error("Upload error:", uploadError);
				return res.status(500).json({ error: "Image upload failed" });
			}

			const { data: urlData } = supabase.storage
				.from("knot")
				.getPublicUrl(filePath);

			if (!urlData?.publicUrl) {
				console.error("Failed to get public URL for", filePath);
				return res.status(500).json({ error: "Failed to get image URL" });
			}

			imageUrls.push(urlData.publicUrl);
		}

		const post = await Post.create({
			user: userId,
			content,
			images: imageUrls,
		});

		res.status(201).json({ message: "Post created", post });
	} catch (err) {
		console.error("Create post error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// Vote (up/down)
export const votePost = async (req, res) => {
	const { postId } = req.params;
	const { vote } = req.body;

	if (!["up", "down"].includes(vote)) {
		return res.status(400).json({ error: "Invalid vote type" });
	}

	try {
		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ error: "Post not found" });

		if (vote === "up") post.upvotes++;
		else post.downvotes++;

		await post.save();

		res.status(200).json({
			message: "Vote recorded",
			upvotes: post.upvotes,
			downvotes: post.downvotes,
		});
	} catch (err) {
		console.error("Vote error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// Comment
export const commentOnPost = async (req, res) => {
	const { postId } = req.params;
	const { text } = req.body;
	const userId = req.user?.id;

	if (!text?.trim()) {
		return res.status(400).json({ error: "Comment text is required" });
	}

	try {
		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ error: "Post not found" });

		post.comments.push({
			user: userId,
			text,
		});

		await post.save();

		res.status(201).json({ message: "Comment added", comments: post.comments });
	} catch (err) {
		console.error("Comment error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

export const getPosts = async (req, res) => {
	const sort = req.query.sort?.toLowerCase() === "random" ? "random" : "top";

	try {
		let posts;

		if (sort === "random") {
			const count = await Post.countDocuments();
			const maxSkip = Math.max(0, count - 20);
			const randomSkip = Math.floor(Math.random() * (maxSkip + 1));

			posts = await Post.find()
				.skip(randomSkip)
				.limit(20)
				.populate("user", "username email profilePic")
				.populate("comments.user", "username");
		} else {
			posts = await Post.find()
				.sort({ upvotes: -1, createdAt: -1 })
				.limit(20)
				.populate("user", "username email profilePic")
				.populate("comments.user", "username");
		}

		res.status(200).json({ posts });
	} catch (err) {
		console.error(`[getPosts] Error while fetching ${sort} posts:`, err);
		res.status(500).json({ error: "Server error" });
	}
};
