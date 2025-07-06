// RichTextEditor.jsx
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const RichTextEditor = ({ content, onChange, editorRef }) => {
	const editor = useEditor({
		extensions: [StarterKit, Image],
		content,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
            attributes: {
              class: "min-h-[120px] max-h-60 overflow-y-auto outline-none text-white bg-black placeholder:text-gray-500 list-disc list-decimal list-inside",
            },
          },          
        
	});

	// Forward editor to parent
	if (editorRef) {
		editorRef.current = editor;
	}

	return (
		<div className="w-full border border-gray-700 rounded-md bg-black text-white p-2">
			<EditorContent editor={editor} />
		</div>
	);
};

export default RichTextEditor;
