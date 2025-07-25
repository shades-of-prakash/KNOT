import React, { useState, useRef } from "react";
import { X, ImageIcon } from "lucide-react";

const CommentInput = () => {
	const [comment, setComment] = useState("");
	const [images, setImages] = useState([]);
	const [dragActive, setDragActive] = useState(false);
	const textareaRef = useRef();

	const handleImageUpload = (files) => {
		const fileArray = Array.from(files);
		const newImages = fileArray.map((file) => ({
			file,
			url: URL.createObjectURL(file),
		}));
		setImages((prev) => [...prev, ...newImages]);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setDragActive(false);
		if (e.dataTransfer.files.length > 0) {
			handleImageUpload(e.dataTransfer.files);
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setDragActive(true);
	};

	const handleDragLeave = () => {
		setDragActive(false);
	};

	const handleRemoveImage = (index) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = () => {
		console.log("Submitted Comment:", comment);
		console.log(
			"Images:",
			images.map((img) => img.file)
		);
		setComment("");
		setImages([]);
	};

	// This function splits text into parts (link vs non-link)
	const renderCommentWithLinks = (text) => {
		const parts = text.split(/(https?:\/\/[^\s]+)/gi);
		return parts.map((part, index) =>
			/^https?:\/\//.test(part) ? (
				<span key={index} className="text-blue-400 underline">
					{part}
				</span>
			) : (
				<span key={index}>{part}</span>
			)
		);
	};

	return (
		<div
			className={`w-full max-w-3xl mx-auto bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-white relative ${
				dragActive ? "ring-2 ring-blue-500" : ""
			}`}
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
		>
			{/* Highlighted Link View */}
			<div className="absolute top-3 left-3 right-3 bottom-[160px] overflow-y-auto text-sm text-transparent pointer-events-none whitespace-pre-wrap break-words">
				<div>{renderCommentWithLinks(comment)}</div>
			</div>

			{/* Actual Textarea */}
			<textarea
				ref={textareaRef}
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				placeholder="Write a comment..."
				className="relative w-full bg-transparent p-3 text-white min-h-[120px] resize-none z-10 caret-white"
				style={{ height: "120px" }}
			/>

			{/* Image Preview */}
			{images.length > 0 && (
				<div className="flex flex-wrap gap-3 mt-3">
					{images.map((img, index) => (
						<div key={index} className="relative w-24 h-24">
							<img
								src={img.url}
								alt="preview"
								className="object-cover w-full h-full rounded"
							/>
							<button
								onClick={() => handleRemoveImage(index)}
								className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white"
							>
								<X size={16} />
							</button>
						</div>
					))}
				</div>
			)}

			{/* Toolbar */}
			<div className="flex items-center justify-between mt-4">
				<label className="flex items-center gap-2 cursor-pointer text-neutral-300 hover:text-white">
					<ImageIcon size={18} />
					<span className="text-sm hidden sm:inline">Add Image</span>
					<input
						type="file"
						accept="image/*"
						multiple
						onChange={(e) => handleImageUpload(e.target.files)}
						className="hidden"
					/>
				</label>

				<button
					onClick={handleSubmit}
					className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
				>
					Comment
				</button>
			</div>
		</div>
	);
};

export default CommentInput;
