import { Post } from "../models/post.js";
import { bucket } from "../config/firebase.js";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export const createPost = async (req, res) => {
	const { title, content } = req.body;
	const userId = req.user?.id;
	const file = req.file;

	if (!title || !content || !file) {
		return res.status(400).json({ error: "Title, content, and image are required" });
	}

	try {
		// Step 1: Convert to WebP
		const webpBuffer = await sharp(file.buffer).webp({ lossless: true }).toBuffer();

		// Step 2: Upload to Firebase
		const filename = `${Date.now()}-${uuidv4()}.webp`;
		const blob = bucket.file(filename);
		const blobStream = blob.createWriteStream({
			metadata: {
				contentType: "image/webp",
				metadata: {
					firebaseStorageDownloadTokens: uuidv4(), // optional if bucket is public
				},
			},
		});

		blobStream.end(webpBuffer);

		blobStream.on("error", (err) => {
			console.error("Firebase upload error:", err);
			return res.status(500).json({ error: "Image upload failed" });
		});

		blobStream.on("finish", async () => {
			const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media`;

			// Step 3: Create post in DB
			const post = await Post.create({
				user: userId,
				title,
				content,
				image: publicUrl,
			});

			res.status(201).json({ message: "Post created", post });
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};
