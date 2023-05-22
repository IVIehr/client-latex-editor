import React from "react";
import { parse, HtmlGenerator } from "latex.js";
import stringDirection from "string-direction";

const Output = ({ content }) => {
  let generator = new HtmlGenerator({ hyphenate: false });

  let outputToHTML = parse(content, { generator: generator }).htmlDocument();
  let parsedHTML = new XMLSerializer().serializeToString(outputToHTML);

  const extractText = (str) => {
    var span = document.createElement("span");
    span.innerHTML = str;
    return span.textContent || span.innerText;
  };

  const finalHTML = (parsedHTML) => {
    let direction = extractText(content);
    const HTMLDirection =
      stringDirection.getDirection(direction) === "ltr" ? "ltr" : "rtl";

    // Add direction the the iframe html
    let index = parsedHTML.indexOf("style") + "style= ".length;

    return (
      parsedHTML.slice(0, index) +
      `direction:${HTMLDirection}; ` +
      parsedHTML.slice(index)
    );
  };

  return (
    <div className="h-screen bg-violet-50 p-4">
      <iframe
        className="output-frame w-full h-full border-0"
        title="Output"
        sandbox="allow-same-origin allow-scripts"
        srcDoc={finalHTML(parsedHTML)}
      ></iframe>
    </div>
  );
};

export default Output;
