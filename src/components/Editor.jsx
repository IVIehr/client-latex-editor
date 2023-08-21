/* eslint-disable no-undef */
import { useEffect, useState, useRef } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import Output from "./Output";
import RenderIf from "../extra/renderIf";
import ToolbarButton from "../extra/toolbar/toolbarButton";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BiChevronDown } from "react-icons/bi";
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

  const handleUndo = () => {
    const editor = editorRef.current.editor;
    editor.undo();
  };

  const handleRedo = () => {
    const editor = editorRef.current.editor;
    editor.redo();
  };

  const handleDropdownChange = (element) => {
    const editor = editorRef.current.editor;
    const selectedText = editor.getSelection();
    const modifiedText = selectedText
      ? `\\${element}{${selectedText}}`
      : `\\${element}{}`;
    editor.replaceSelection(modifiedText);
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
        <div className="w-1/2 text-white flex flex-col flex-1">
          <div className="flex justify-between bg-[#673AB7] p-2 h-12">
            <div className="flex items-center">
              <ToolbarButton name="Undo" onClick={handleUndo} />
              <ToolbarButton name="Redo" onClick={handleRedo} />
              <ToolbarButton name="Erase" onClick={handleClean} />
            </div>
            <div className="flex flex-wrap">
              <Menu as="div" className="relative inline-block text-right">
                <div>
                  <Menu.Button className="inline-flex bg-transparent cursor-pointer hover:bg-violet-900 rounded focus:outline-none p-1 text-sm font-normal">
                    Add element
                    <BiChevronDown className="mt-1 ml-2"/>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute z-10 left-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 font-bold text-lg`}
                            onClick={() => {
                              handleDropdownChange("section");
                            }}
                          >
                            section
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 font-bold`}
                            onClick={() => {
                              handleDropdownChange("subsection");
                            }}
                          >
                            subsection
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm font-bold`}
                            onClick={() => {
                              handleDropdownChange("subsubsection");
                            }}
                          >
                            subsubsection
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2`}
                            onClick={() => {
                              handleDropdownChange("paragraph");
                            }}
                          >
                            paragraph
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            onClick={() => {
                              handleDropdownChange("subparagraph");
                            }}
                          >
                            subparagraph
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
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
                lineWrapping: true
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
