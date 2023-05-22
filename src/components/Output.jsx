import React from "react";
import { parse, HtmlGenerator } from "latex.js";

const Output = ({ content }) => {
  let latex =
    "\\documentclass{article}\n\n\\begin{document}\n\n\\section{Introduction}\nThis is a sample LaTeX document.\n\n\\subsection{Subsection}\nHere is some text in a subsection.\n\n\\end{document}";
  let generator = new HtmlGenerator({ hyphenate: false });

  let doc = parse(content, { generator: generator }).htmlDocument();
  return (
    <div className="h-screen bg-violet-50 p-4">
      <iframe
        className="output-frame w-full h-full border-0"
        title="Output"
        sandbox="allow-same-origin allow-scripts"
        srcDoc={new XMLSerializer().serializeToString(doc)}
      ></iframe>
    </div>
  );
};

export default Output;
