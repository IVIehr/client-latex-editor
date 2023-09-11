/* eslint-disable react/prop-types */
import { Tooltip } from "react-tippy";
import { DocIcon, PlusCircleIcon } from "../assets/svg";
import { useState } from "react";

const FileBar = ({ content, getContent, switchContent, setSwitchContent }) => {
  const initialContent = content ? JSON.parse(content) : {};
  const [parsedContent, setParsedContent] = useState(initialContent);

  const [editKey, setEditKey] = useState("");

  const handleNewTemp = () => {
    let newKey = "New File";
    let count = 1;

    while (newKey in parsedContent) {
      newKey = `New File ${count}`;
      count++;
    }

    const updatedContent = { ...parsedContent, [newKey]: " " };
    setParsedContent(updatedContent);
    getContent(JSON.stringify(updatedContent));
  };

  const handleClickItem = (key) => {
    setSwitchContent(key);
  };

  const handleDoubleClick = (key) => {
    setEditKey(key);
  };

  const handleInputChange = (e, oldKey) => {
    const newKey = e.target.value;
    setEditKey(newKey);
    if (newKey in parsedContent) {
      alert("نام تکراری است");
    } else {
      setParsedContent((prevState) => {
        const updatedContent = { ...prevState };
        updatedContent[newKey] = updatedContent[oldKey];
        delete updatedContent[oldKey];
        if (oldKey !== newKey) {
          getContent(JSON.stringify(updatedContent));
        }
        return updatedContent;
      });
    }
  };

  const handleInputBlur = () => {
    if (editKey !== "") {
      setEditKey(""); // Clear the editKey state
      getContent(JSON.stringify(parsedContent));
    }
  };

  return (
    <div className="h-screen bg-purple-200 w-[13%] border-r-2 border-[#673AB7]">
      <div className="flex bg-[#673AB7] p-2 h-12">
        <Tooltip
          title="Add template"
          position="top"
          arrow={true}
          animation="fade"
          theme="transparent"
          size="small"
        >
          <div
            className="bg-transparent cursor-pointer hover:bg-violet-900 p-1 rounded focus:outline-none"
            onClick={handleNewTemp}
          >
            <PlusCircleIcon className="w-7" />
          </div>
        </Tooltip>
      </div>
      {Object.keys(parsedContent).map((key, index) => (
        <div
          key={index}
          className={`flex cursor-pointer hover:bg-[#bdb3d1] mb-1 ${
            switchContent === key && "bg-[#bdb3d1]"
          }`}
          onClick={() => handleClickItem(key)}
        >
          <DocIcon fill={"#673AB7"} className="w-6 my-2 mx-3" />
          {editKey === key && key !== "main" ? (
            <input
              type="text"
              value={editKey || ""}
              onChange={(e) => handleInputChange(e, key)}
              autoFocus
              onBlur={handleInputBlur}
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "4px 8px",
                margin: "3px",
                fontSize: "14px",
                outline: "none",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                boxSizing: "border-box",
                width: "100%",
              }}
            />
          ) : (
            <span
              className="my-2 mr-2 text-[#673AB7]"
              onDoubleClick={() => handleDoubleClick(key)}
            >
              {key}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileBar;
