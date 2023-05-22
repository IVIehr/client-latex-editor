import React, { useState } from "react";
import { FaPlay, FaClipboard, FaTrash } from "react-icons/fa";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/stex/stex";

const Editor = ({ onRender }) => {
  const [content, setContent] = useState(
    "\\documentclass{article}\n\n\\begin{document}\n\n\\section{بخش}\nاین یک نمونه سند لاتکس است\n\n\\subsection{زیربخش}\nاین یک نمونه متن در زیربخش است.\n\n\\end{document}"
  );

  const handleRender = () => {
    onRender(content);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content);
  };

  const handleClean = () => {
    setContent("");
  };

  return (
    <div className="flex-1 bg-violet-600 text-white flex flex-col">
      <div className="flex justify-between bg-violet-600 p-2">
        <div className="flex items-center">
          <span className="text-violet-50 text-lg font-bold">LaTeX</span>
          <span className="text-gray-200 text-sm ml-1">ویرایشگر</span>
        </div>
        <div>
          <button
            className="bg-transparent hover:bg-white hover:text-violet-900 text-violet-50 px-4 py-2 rounded mr-2"
            onClick={handleRender}
          >
            <FaPlay />
          </button>
          <button
            className="bg-transparent hover:bg-white hover:text-violet-900 text-violet-50 px-4 py-2 rounded mr-2"
            onClick={handleCopyToClipboard}
          >
            <FaClipboard />
          </button>
          <button
            className="bg-transparent hover:bg-white hover:text-violet-900 text-violet-50 px-4 py-2 rounded"
            onClick={handleClean}
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <div className="editorContainer">
        <CodeMirror
        className="CodeMirror"
          value={content}
          options={{
            mode: "stex",
            lineNumbers: true,
          }}
          onBeforeChange={(editor, data, code) => {
            setContent(code);
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
