import React, { useEffect } from "react";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Toolbar from "./ToolBar";
import { EditorContent } from "@tiptap/react";

export default function EditorComponent({ blog, setBlog }) {
  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit, // includes bold, italic, heading, etc.
    ],
    content: blog.content, // Preload content if editing
    onUpdate: ({ editor }) => {
      setBlog({ ...blog, content: editor.getHTML() }); // Update the blog content on each change
    },
  });

  // Synchronize editor content when `blog.content` changes (e.g., after fetching from API)
  useEffect(() => {
    if (editor && blog.content !== editor.getHTML()) {
      editor.commands.setContent(blog.content); // Set the HTML content in the editor
    }
  }, [blog.content, editor]);

  return (
    <div className="editor-container">
      <Toolbar editor={editor} />
      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
