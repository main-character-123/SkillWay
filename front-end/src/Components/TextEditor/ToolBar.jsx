import React from "react";
import {
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaHeading,
  FaStrikethrough,
  FaQuoteLeft,
  FaCode,
} from "react-icons/fa";

export default function Toolbar({ editor }) {
  if (!editor) {
    return null; // Return nothing if the editor is not available
  }

  const handleButtonClick = (e) => {
    e.preventDefault(); // Prevent form submission
  };

  return (
    <div className="editor-toolbar">
      {/* Bold Button */}
      <button
        onClick={(e) => {
          handleButtonClick(e);
          editor.chain().focus().toggleBold().run();
        }}
        className={`toolbar-btn ${editor.isActive("bold") ? "active" : ""}`}
      >
        <FaBold />
      </button>

      {/* Italic Button */}
      <button
        onClick={(e) => {
          handleButtonClick(e);
          editor.chain().focus().toggleItalic().run();
        }}
        className={`toolbar-btn ${editor.isActive("italic") ? "active" : ""}`}
      >
        <FaItalic />
      </button>

      {/* Strike-through Button */}
      <button
        onClick={(e) => {
          handleButtonClick(e);
          editor.chain().focus().toggleStrike().run();
        }}
        className={`toolbar-btn ${editor.isActive("strike") ? "active" : ""}`}
      >
        <FaStrikethrough />
      </button>

      {/* Heading 1 Button */}
      <button
        onClick={(e) => {
          handleButtonClick(e);
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className={`toolbar-btn ${
          editor.isActive("heading", { level: 1 }) ? "active" : ""
        }`}
      >
        <FaHeading />
      </button>

      {/* Heading 2 Button */}
      <button
        onClick={(e) => {
          handleButtonClick(e);
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={`toolbar-btn ${
          editor.isActive("heading", { level: 2 }) ? "active" : ""
        }`}
      >
        <FaHeading />
      </button>

      {/* Blockquote Button */}
      <button
        onClick={(e) => {
          handleButtonClick(e);
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={`toolbar-btn ${
          editor.isActive("blockquote") ? "active" : ""
        }`}
      >
        <FaQuoteLeft />
      </button>

      {/* Code Block Button */}
      <button
        onClick={(e) => {
          handleButtonClick(e);
          editor.chain().focus().toggleCodeBlock().run();
        }}
        className={`toolbar-btn ${
          editor.isActive("codeBlock") ? "active" : ""
        }`}
      >
        <FaCode />
      </button>

      {/* Bullet List Button */}
      <button
        onClick={(e) => {
          handleButtonClick(e);
          editor.chain().focus().toggleBulletList().run();
        }}
        className={`toolbar-btn ${
          editor.isActive("bulletList") ? "active" : ""
        }`}
      >
        <FaListUl />
      </button>

      {/* Ordered List Button */}
      <button
        onClick={(e) => {
          handleButtonClick(e);
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={`toolbar-btn ${
          editor.isActive("orderedList") ? "active" : ""
        }`}
      >
        <FaListOl />
      </button>
    </div>
  );
}
