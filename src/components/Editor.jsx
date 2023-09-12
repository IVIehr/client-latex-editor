/* eslint-disable no-undef */
import { useEffect, useState, useRef } from "react";
import Output from "./Output";
import FileBar from "./fileBar";
import RenderIf from "../extra/renderIf";
import EditorComponent from "./editorComponent";

const Editor = () => {
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(true);
  const [switchContent, setSwitchContent] = useState("main");
  const saveRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (saveRef) {
      saveRef.current = false;
    } else {
      saveRef.current = true;
    }

    if (contentRef.current) {
      const prevContent = JSON.parse(contentRef.current);
      const updatedContent = { ...prevContent, [switchContent]: content };
      contentRef.current = JSON.stringify(updatedContent);
    }
  }, [content]);

  useEffect(() => {
    if (contentRef.current) {
      const prevContent = JSON.parse(contentRef.current);
      setContent(prevContent[switchContent]);
    }
  }, [switchContent]);

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
      }
    });
  }, [saveRef]);

  const readEditorData = async (event) => {
    const { action, key, value } = event.data;
    console.log("action", action);
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
          const cnt = JSON.parse(value);
          setContent(cnt.main);
          contentRef.current = value;
        } else {
          const out = {
            main: "",
          };
          contentRef.current = JSON.stringify(out);
        }
        break;
      case "load":
        if (value) {
          const cnt = JSON.parse(value);
          setContent(cnt.main);
          contentRef.current = value;
        } else {
          const out = {
            main: "",
          };
          contentRef.current = JSON.stringify(out);
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

  const handleNewTemp = (cnt) => {
    contentRef.current = cnt;
  };

  return (
    <>
      <RenderIf isTrue={!preview}>
        <FileBar
          content={contentRef.current}
          getContent={handleNewTemp}
          setSwitchContent={setSwitchContent}
          switchContent={switchContent}
        />
      </RenderIf>
      <div className="w-full flex">
        <RenderIf isTrue={!preview}>
          <div className="w-1/2 text-white flex flex-col flex-1">
            <EditorComponent setContent={setContent} content={content} />
          </div>
        </RenderIf>
        <div className="bg-gray-200 flex-1">
          <Output
            content={content}
            previewMode={preview}
            contentObject={contentRef.current}
          />
        </div>
      </div>
    </>
  );
};
export default Editor;
