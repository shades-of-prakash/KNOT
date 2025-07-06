import { Post } from "../models/post.js";
import { bucket } from "../config/firebase.js";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export const createPost = async (req, res) => {
	const { title, content } = req.body;
	const userId = req.user?.id;
	const files = req.files;

	if (!title || !content || !files || files.length === 0) {
		return res
			.status(400)
			.json({ error: "Title, content, and at least one image are required" });
	}

	try {
		const imageUrls = [];

		for (const file of files) {
			// Convert to WebP
			const webpBuffer = await sharp(file.buffer)
				.webp({ lossless: true })
				.toBuffer();

			// Upload to Firebase
			const filename = `${Date.now()}-${uuidv4()}.webp`;
			const blob = bucket.file(filename);
			const blobStream = blob.createWriteStream({
				metadata: {
					contentType: "image/webp",
					metadata: {
						firebaseStorageDownloadTokens: uuidv4(),
					},
				},
			});

			// Await stream finish as a promise
			await new Promise((resolve, reject) => {
				blobStream.on("error", reject);
				blobStream.on("finish", resolve);
				blobStream.end(webpBuffer);
			});

			const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
				filename
			)}?alt=media`;

			imageUrls.push(publicUrl);
		}

		// Save post
		const post = await Post.create({
			user: userId,
			title,
			content,
			images: imageUrls,
		});

		res.status(201).json({ message: "Post created", post });
	} catch (err) {
		console.error("Create post error:", err);
		res.status(500).json({ error: "Server error" });
	}
};
