/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import {
  Bold,
  Italic,
  Underline,
  Indent,
  Numberedlist,
  Bulletedlist,
  Link,
  Comment,
  Justifycenter,
  Justifyright,
  Justifyleft,
  Undo,
  Redo,
} from "../../assets/svg";
import { TbEraser } from "react-icons/tb";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

const icon = {
  Bold: Bold,
  Italic: Italic,
  Underline: Underline,
  Indent: Indent,
  Numberedlist: Numberedlist,
  Bulletedlist: Bulletedlist,
  Link: Link,
  Comment: Comment,
  Justifycenter: Justifycenter,
  Justifyright: Justifyright,
  Justifyleft: Justifyleft,
  Undo: Undo,
  Redo: Redo,
  Erase: TbEraser,
};

const ToolbarButton = ({ name, onClick }) => {
  const IconToRender = icon[name];

  return (
    <Tooltip
      title={name}
      position="top"
      arrow={true}
      animation="fade"
      theme="transparent"
      size="small"
    >
      <div
        className="bg-transparent cursor-pointer hover:bg-violet-900 p-2 rounded mr-2 focus:outline-none"
        onClick={onClick}
      >
        <IconToRender
          className="w-4 h-4"
          fill={name === "Erase" ? "none" : "white"}
        />
      </div>
    </Tooltip>
  );
};

export default ToolbarButton;
