// components/MenuBar.jsx
import React, { useRef } from "react";

const MenuBar = ({ editor }) => {
	const fileInputRef = useRef();

	if (!editor) return null;

	const insertImage = (url) => {
		editor.chain().focus().setImage({ src: url }).run();
	};

	const handleFileChange = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			insertImage(reader.result); // base64 or server-based
		};
		reader.readAsDataURL(file);
	};

	return (
		<div className="flex flex-wrap gap-2">
			<button
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={`px-2 py-1 rounded ${
					editor.isActive("bold") ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-300"
				}`}
			>
				B
			</button>
			<button
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={`px-2 py-1 rounded ${
					editor.isActive("italic") ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-300"
				}`}
			>
				I
			</button>
			<button
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={`px-2 py-1 rounded ${
					editor.isActive("bulletList") ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-300"
				}`}
			>
				• List
			</button>
			<button
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={`px-2 py-1 rounded ${
					editor.isActive("orderedList") ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-300"
				}`}
			>
				1. List
			</button>
			<button
				onClick={() => fileInputRef.current.click()}
				className="px-2 py-1 bg-gray-800 text-gray-300 rounded"
			>
				📷 Image
			</button>
			<input
				type="file"
				accept="image/*"
				className="hidden"
				ref={fileInputRef}
				onChange={handleFileChange}
			/>

			<button
				onClick={() => editor.chain().focus().undo().run()}
				className="px-2 py-1 bg-gray-800 text-gray-300 rounded"
			>
				Undo
			</button>
			<button
				onClick={() => editor.chain().focus().redo().run()}
				className="px-2 py-1 bg-gray-800 text-gray-300 rounded"
			>
				Redo
			</button>
		</div>
	);
};

export default MenuBar;
