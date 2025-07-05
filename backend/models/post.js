import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		title: { type: String, required: true },
		content: { type: String, required: true }, // rich text HTML
		image: { type: String, required: true },   // Firebase public URL
	},
	{ timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
