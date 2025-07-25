import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		content: { type: String, required: true },
		images: [{ type: String }],
		upvotes: { type: Number, default: 0 },
		downvotes: { type: Number, default: 0 },
		comments: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				text: { type: String, required: true },
				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
