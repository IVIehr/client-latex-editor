/* eslint-disable react/prop-types */
import { Tooltip } from "react-tippy";
import { DocIcon, PlusCircleIcon } from "../assets/svg";
import { useState } from "react";

const FileBar = ({ content, getContent }) => {
  const initialContent = content ? JSON.parse(content) : {};
  const [parsedContent, setParsedContent] = useState(initialContent);

  const handleNewTemp = () => {
    const updatedContent  = { ...parsedContent, sample: Math.random() };
    setParsedContent(updatedContent);
    getContent(JSON.stringify(updatedContent ));
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
              key === "main" && "bg-[#bdb3d1]"
            }`}
          >
            <DocIcon fill={"#673AB7"} className="w-6 my-2 mx-3" />
            <span className="my-2 text-[#673AB7]">{key}</span>
          </div>
        ))}
    </div>
  );
};

export default FileBar;
