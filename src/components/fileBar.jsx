/* eslint-disable react/prop-types */
import { Tooltip } from "react-tippy";
import { DocIcon, PlusCircleIcon } from "../assets/svg";
import { useState } from "react";

const FileBar = ({ content, getContent, switchContent, setSwitchContent }) => {
  const initialContent = content ? JSON.parse(content) : {};
  const [parsedContent, setParsedContent] = useState(initialContent);

  const [editKey, setEditKey] = useState("");

  const handleNewTemp = () => {
    const updatedContent = { ...parsedContent, profile: " " };
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
    setParsedContent((prevState) => {
      const updatedContent = { ...prevState };
      updatedContent[newKey] = updatedContent[oldKey];
      delete updatedContent[oldKey];
      if (oldKey !== newKey) {
        getContent(JSON.stringify(updatedContent));
      }
      return updatedContent;
    });
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
          {editKey === key ? (
            <input
              type="text"
              value={editKey}
              onChange={(e) => handleInputChange(e, key)}
              autoFocus
            />
          ) : (
            <span
              className="my-2 text-[#673AB7]"
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
