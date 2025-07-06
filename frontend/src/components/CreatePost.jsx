import React, { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";

function EditableInput({ value, onChange, placeholder = "What’s happening?" }) {
	const ref = useRef();

	useEffect(() => {
		if (ref.current && ref.current.textContent !== value) {
			ref.current.textContent = value || "";
		}
	}, [value]);

	const handleInput = (e) => {
		const text = e.currentTarget.textContent;
		onChange(text);
	};

	return (
		<div className="relative w-full">
			<div
				ref={ref}
				contentEditable
				role="textbox"
				onInput={handleInput}
				className="w-full min-h-[36px] text-white outline-none whitespace-pre-wrap break-words"
				suppressContentEditableWarning={true}
		 />
			{!value?.trim() && (
				<div className="absolute top-0 left-0 pointer-events-none text-gray-500">
					{placeholder}
				</div>
			)}
		</div>
	);
}


function CreatePost({ dialogRef }) {
	const [images, setImages] = useState([]);
	const [dragOver, setDragOver] = useState(false);
	const [text, setText] = useState("");

	const closeDialog = () => {
		dialogRef.current?.close();
		setImages([]);
		setText("");
	};

	const handleFiles = (files) => {
		const newImages = [...files].map((file) => ({
			file,
			url: URL.createObjectURL(file),
		}));
		setImages((prev) => [...prev, ...newImages]);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
		if (e.dataTransfer.files.length) {
			handleFiles(e.dataTransfer.files);
		}
	};

	const handleImageChange = (e) => {
		handleFiles(e.target.files);
	};

	const removeImage = (url) => {
		setImages((prev) => prev.filter((img) => img.url !== url));
	};

	const handleSubmit = async () => {
		try {
			const formData = new FormData();
			formData.append("text", text);
			images.forEach((img, idx) => {
				if (img.file) {
					formData.append("images", img.file);
				}
			});

			const response = await fetch("/api/posts/createpost", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				console.log("Post submitted successfully");
				closeDialog();
			} else {
				console.error("Failed to submit post");
			}
		} catch (err) {
			console.error("Error submitting post:", err);
		}
	};

	return (
		<dialog
			ref={dialogRef}
			className="fixed bg-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-black/70 border-none p-0 m-0 rounded-xl"
		>
			<div
				onDrop={handleDrop}
				onDragOver={(e) => {
					e.preventDefault();
					setDragOver(true);
				}}
				onDragLeave={() => setDragOver(false)}
				className={`border-2 border-violet-600 bg-black text-white w-[600px] h-auto rounded-xl overflow-hidden p-4 transition ${
					dragOver ? "border-dashed border-blue-400" : ""
				}`}
			>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold">New Post</h2>
					<button onClick={closeDialog} className="text-xl hover:text-gray-400">
						&times;
					</button>
				</div>

				<EditableInput value={text} onChange={setText} placeholder="What’s happening?" />

				{images.length > 0 && (
					<div className="flex overflow-x-auto gap-4 mt-4 mb-4 scrollbar-none">
						{images.map((img, idx) => (
							<div key={idx} className="relative h-[300px] flex-shrink-0">
								<img
									src={img.url}
									alt="preview"
									className="h-full w-auto object-contain rounded border border-violet-600/20"
								/>
								<button
									onClick={() => removeImage(img.url)}
									className="absolute top-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded-bl"
								>
									<X size={14} />
								</button>
							</div>
						))}
					</div>
				)}

				<div className="flex items-center justify-between mt-2">
					<div className="flex gap-4 items-center text-white">
						<label className="cursor-pointer hover:text-violet-400">
							📷
							<input
								type="file"
								multiple
								accept="image/*"
								onChange={handleImageChange}
								className="hidden"
							/>
						</label>
					</div>

					<button
						onClick={handleSubmit}
						disabled={!text.trim() && images.length === 0}
						className="bg-violet-600 text-white px-6 py-2 rounded-full font-semibold disabled:opacity-40"
					>
						Post
					</button>
				</div>
			</div>
		</dialog>
	);
}

export default CreatePost;
