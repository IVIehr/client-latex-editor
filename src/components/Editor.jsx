/* eslint-disable no-undef */
import { useEffect, useState, useRef } from "react";
import { FaTrash } from "react-icons/fa";
import { Controlled as CodeMirror } from "react-codemirror2";
import Output from "./Output";
import RenderIf from "../extra/renderIf";
import ToolbarButton from "../extra/toolbar/toolbarButton";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/base16-light.css";
import "codemirror/mode/stex/stex";

const Editor = () => {
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(true);
  const saveRef = useRef(null);
  const contentRef = useRef(null);
  const editorRef = useRef(null);

  const handleClean = () => {
    setContent("");
  };

  const handleStyling = (styling) => {
    var type;
    switch (styling) {
      case "bold":
        type = "\\textbf";
        break;
      case "italic":
        type = "\\textit";
        break;
      case "underline":
        type = "\\underline";
    }
    const editor = editorRef.current.editor;
    const selectedText = editor.getSelection();

    if (selectedText) {
      const modifiedText = `${type}{${selectedText}}`;
      editor.replaceSelection(modifiedText);
    } else {
      editor.replaceSelection(`${type}{}`);
    }
  };

  const handleLink = () => {
    const editor = editorRef.current.editor;
    const selectedText = editor.getSelection();

    if (selectedText) {
      const modifiedText = `\\url{${selectedText}}`;
      editor.replaceSelection(modifiedText);
    }
  };

  const handleList = (type) => {
    const editor = editorRef.current.editor;
    const selectedText = editor.getSelection();

    if (selectedText) {
      const lines = selectedText.split("\n");
      const modifiedLines = lines.map((line) => `\\item ${line}`).join("\n");
      const modifiedText = `\\begin{${type}}\n${modifiedLines}\n\\end{${type}}`;
      editor.replaceSelection(modifiedText);
    } else {
      editor.replaceSelection(`\\begin{${type}}\n\\item \n\\end{${type}}`);
    }
  };

  const handleCommand = (command) => {
    const editor = editorRef.current.editor;
    const selectedText = editor.getSelection();

    if (selectedText) {
      const modifiedText = `\\begin{${command}}\n${selectedText}\n\\end{${command}}`;
      editor.replaceSelection(modifiedText);
    } else {
      editor.replaceSelection(`\\begin{${command}}\n\n\\end{${command}}`);
    }
  };

  useEffect(() => {
    contentRef.current = content;
    if (saveRef) {
      saveRef.current = false;
    } else {
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
                className="bg-transparent hover:bg-white hover:text-violet-900 text-violet-50 px-4 py-2 rounded focus:outline-none"
                onClick={handleClean}
              >
                <FaTrash />
              </button>
            </div>
            <div className="flex">
              <ToolbarButton
                name="Bold"
                onClick={() => handleStyling("bold")}
              />
              <ToolbarButton
                name="Italic"
                onClick={() => handleStyling("italic")}
              />
              <ToolbarButton
                name="Underline"
                onClick={() => handleStyling("underline")}
              />
              <ToolbarButton name="Link" onClick={handleLink} />
              <ToolbarButton
                name="Comment"
                onClick={() => handleCommand("comment")}
              />
              <ToolbarButton
                name="Indent"
                onClick={() => handleCommand("quote")}
              />
              <ToolbarButton
                name="Numberedlist"
                onClick={() => handleList("enumerate")}
              />
              <ToolbarButton
                name="Bulletedlist"
                onClick={() => handleList("itemize")}
              />
              <ToolbarButton
                name="Justifyright"
                onClick={() => handleCommand("flushright")}
              />
              <ToolbarButton
                name="Justifycenter"
                onClick={() => handleCommand("center")}
              />
              <ToolbarButton
                name="Justifyleft"
                onClick={() => handleCommand("flushleft")}
              />
            </div>
          </div>
          <div className="editorContainer">
            <CodeMirror
              ref={editorRef}
              className="CodeMirror"
              value={content}
              options={{
                mode: "stex",
                lineNumbers: true,
                theme: "base16-light",
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
