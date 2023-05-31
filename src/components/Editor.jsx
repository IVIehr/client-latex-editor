import { useEffect, useState, useRef } from "react";
import { FaClipboard, FaTrash } from "react-icons/fa";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/stex/stex";
import Output from "./Output";

const Editor = ({ loading, setLoading }) => {
  const [content, setContent] = useState("");
  const contentRef = useRef(null);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content);
  };

  const handleClean = () => {
    setContent("");
  };

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    window.addEventListener("message", readEditorData, false);

    return () => {
      window.removeEventListener("message", readEditorData);
    };
  }, []);

  const readEditorData = async (event) => {
    const { action, key, value } = event.data;
    console.log("message from parent recieved:", event.data);
    console.log("content ref", contentRef);

    switch (action) {
      case "get-data":
        event.source.postMessage(
          {
            action,
            key,
            value: contentRef.current,
          },
          "*"
        );
        break;
      case "set-data":
        if (value) {
          contentRef.current = value;
        }
        break;
      case "load":
        console.log("action in load", action);
        if (value) {
          setContent(value);
        }
        break;
    }
  };

  return (
    <>
      <div className="w-1/2 bg-violet-600 text-white flex flex-col flex-1">
        <div className="flex justify-between bg-violet-600 p-2">
          <div className="flex items-center">
            <span className="text-violet-50 text-lg font-bold">LaTeX</span>
            <span className="text-gray-200 text-sm ml-1">ویرایشگر</span>
          </div>
          <div>
            <button
              className="bg-transparent hover:bg-white hover:text-violet-900 text-violet-50 px-4 py-2 rounded mr-2 focus:outline-none"
              onClick={handleCopyToClipboard}
            >
              <FaClipboard />
            </button>
            <button
              className="bg-transparent hover:bg-white hover:text-violet-900 text-violet-50 px-4 py-2 rounded focus:outline-none"
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
      <div className="w-1/2 bg-gray-200">
        <Output content={content} />
      </div>
    </>
  );
};

const WrapperEditor = () => {
  const [loading, setLoading] = useState(false);

  return <Editor loading={loading} setLoading={setLoading} />;
};
export default WrapperEditor;
