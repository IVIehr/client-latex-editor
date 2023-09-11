/* eslint-disable react/prop-types */
import { Tooltip } from "react-tippy";
import { DocIcon, PlusCircleIcon } from "../assets/svg";
import { useRef } from "react";

const FileBar = ({ content, getContent }) => {
  const parsedContent = useRef();

  try {
    parsedContent.current = JSON.parse(content);
  } catch (error) {
    console.error("Error parsing content:", error);
  }

  const handleNewTemp = () => {
    const test = { ...parsedContent.current, profile: Math.random() };
    parsedContent.current = test;
    getContent(JSON.stringify(test));
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
      {/* <div className="flex cursor-pointer hover:bg-[#bdb3d1] bg-[#bdb3d1] mb-1">
        <DocIcon fill={"#673AB7"} className="w-6 my-2 mx-3" />
        <span className="my-2 text-[#673AB7]">main.tex</span>
      </div>
      {parsedContent.current !== undefined &&
        Object.keys(parsedContent.current).includes("profile") && (
          <div className="flex cursor-pointer hover:bg-[#bdb3d1]">
            <DocIcon fill={"#673AB7"} className="w-6 my-2 mx-3" />
            <span className="my-2 text-[#673AB7]">profile.tex</span>
          </div>
        )} */}
      {parsedContent.current &&
        Object.keys(parsedContent.current).map((key, index) => (
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
