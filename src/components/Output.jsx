import React from "react";
import { parse, HtmlGenerator } from "latex.js";
import stringDirection from "string-direction";

const Output = ({ content }) => {
  let generator = new HtmlGenerator({ hyphenate: false });

  const extractText = (str) => {
    var span = document.createElement("span");
    span.innerHTML = str;
    return span.textContent || span.innerText;
  };

  const finalHTML = () => {
    let direction = extractText(content);
    const HTMLDirection =
      stringDirection.getDirection(direction) === "ltr" ? "ltr" : "rtl";

    try {
      // Parse latex to HTML
      let outputToHTML = parse(content, {
        generator: generator,
      }).htmlDocument();

      // Convert HTML to string
      let parsedHTML = new XMLSerializer().serializeToString(outputToHTML);

      // Extract the content of <body> tag from string output
      var bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(parsedHTML)[1];

      return `<div style="direction:${HTMLDirection}; font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;">${bodyHtml}</div>`;
    } catch (error) {
      const errorBody = `<h4 style="color: red;">${error}</h4>`;
      if (error.location) {
        return `${errorBody} at line ${error.location.start.line}`;
      } else {
        return errorBody;
      }
    }
  };

  return (
    <div className="h-screen bg-violet-50 p-4">
      <iframe
        className="output-frame w-full h-full border-0"
        title="Output"
        srcDoc={finalHTML()}
      ></iframe>
    </div>
  );
};

export default Output;
