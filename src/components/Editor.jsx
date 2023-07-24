/* eslint-disable no-undef */
import { useEffect, useState, useRef } from "react";
import { FaClipboard, FaTrash } from "react-icons/fa";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/base16-light.css";
import "codemirror/mode/stex/stex";
import Output from "./Output";
import RenderIf from "../renderif";

const Editor = () => {
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(true);
  const saveRef = useRef(null);
  const contentRef = useRef(null);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content);
  };

  const handleClean = () => {
    setContent("");
  };

  useEffect(() => {
    contentRef.current = content;
    if(saveRef){
      saveRef.current = false;
    }
    else{
      saveRef.current = true;
    }
  }, [content]);

  useEffect(() => {
    window.addEventListener("message", readEditorData, false);

    return () => {
      window.removeEventListener("message", readEditorData);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      if (!saveRef.current) {
        event.preventDefault();
        event.returnValue = "sure to save?";
      }
    });
  }, [saveRef]);

  const readEditorData = async (event) => {
    const { action, key, value } = event.data;
    switch (action) {
      case "get-data":
        saveRef.current = true;
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
          setContent(value);
        }
        break;
      case "load":
        if (value) {
          setContent(value);
        }
        setPreview(true);
        break;
      case "preview":
        setPreview(true);
        break;
      case "edit":
        setPreview(false);
        break;
    }
  };

  return (
    <div className="w-full flex">
      <RenderIf isTrue={!preview}>
        <div className="w-1/2 bg-violet-600 text-white flex flex-col flex-1">
          <div className="flex justify-between bg-violet-600 p-2">
            <div className="flex items-center">
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
                theme: 'base16-light',
              }}
              onBeforeChange={(editor, data, code) => {
                setContent(code);
              }}
            />
          </div>
        </div>
      </RenderIf>
      <div className={`bg-gray-200 flex-1`}>
        <Output content={content} previewMode={preview} />
      </div>
    </div>
  );
};
export default Editor;
