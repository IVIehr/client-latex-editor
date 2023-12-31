/* eslint-disable react/prop-types */
import { parse, HtmlGenerator } from "latex.js";
import { useEffect, useState, useRef } from "react";
import stringDirection from "string-direction";
import { RiFilePaper2Fill } from "react-icons/ri";
import { HiDownload } from "react-icons/hi";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import RenderIf from "../extra/renderIf";
import html2pdf from "html2pdf.js";
import { ESize, EPaper } from "../extra/enum";

const Output = ({ content, previewMode, contentObject }) => {
  const [documentWidth, setDocumentWidth] = useState("75%");
  const [documentHeight, setDocumentHeight] = useState("20cm");
  const [size, setSize] = useState(EPaper.A4);
  let generator = new HtmlGenerator({ hyphenate: false });
  const iframeRef = useRef(null);
  const contentRef = useRef();
  const [outputContent, setOutputContent] = useState(content);

  useEffect(() => {
    if (!previewMode) {
      setDocumentWidth("75%");
      setDocumentHeight("20cm");
      setSize(EPaper.A4);
    }
  }, [previewMode]);

  useEffect(() => {
    setOutputContent(content);
    contentRef.current = content;
    const regex = /\\input\{([^}]+)\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    if (contentObject && matches.length !== 0) {
      const object = JSON.parse(contentObject);
      for (const [key, value] of Object.entries(object)) {
        if (matches.includes(key)) {
          const replacedContent = contentRef.current.replace(
            `\\input{${key}}`,
            () => {
              return value;
            }
          );
          setOutputContent(replacedContent);
          contentRef.current = replacedContent;
        }
      }
    }
  }, [content, contentObject]);

  const resize = (paper) => {
    setDocumentWidth(paper.width);
    setDocumentHeight(paper.height);
  };

  const extractText = (str) => {
    var span = document.createElement("span");
    span.innerHTML = str;
    return span.textContent || span.innerText;
  };

  const finalHTML = (outputText) => {
    let direction = extractText(outputText);
    const HTMLDirection =
      stringDirection.getDirection(direction) === "ltr" ? "ltr" : "rtl";

    try {
      // Parse latex to HTML
      let outputToHTML = parse(outputText, {
        generator: generator,
      }).htmlDocument();

      // Convert HTML to string
      let parsedHTML = new XMLSerializer().serializeToString(outputToHTML);

      // Extract the content of <body> tag from string output
      var bodyHTML = /<body.*?>([\s\S]*)<\/body>/.exec(parsedHTML)[1];

      var completeHTML = `
      <!DOCTYPE html>
      <html lang="en" style="scroll-behavior: smooth;">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>latex output</title>
          <link type="text/css" rel="stylesheet" href="https://latex.js.org/css/base.css">
          <link type="text/css" rel="stylesheet" href="https://latex.js.org/css/katex.css">
          <link type="text/css" rel="stylesheet" href="https://latex.js.org/css/article.css">
          <link type="text/css" rel="stylesheet" href="https://latex.js.org/css/error.css">
          <script src="https://latex.js.org/js/base.js"></script>
          <script>document.addEventListener("DOMContentLoaded", function l(){for(var e=document.getElementsByTagName("a"),t=0;t<e.length;t++)e[t].getAttribute("href").startsWith("#")&&e[t].addEventListener("click",(function(e){e.preventDefault();var t=e.target.getAttribute("href").substr(1),r=document.getElementById(t);document.scrollingElement.scrollTop=offsetTop(r)}))})</script>
        </head>
        <body>
          <div class="main"
            style="direction:${HTMLDirection};
            font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
            padding:1.5cm 2cm;
            background: white;
            margin: auto;
            margin-bottom: 1.5cm;
            width: ${documentWidth};
            min-height: ${documentHeight};
            box-shadow: 0 0px 8px 0px #888888ab;
            font-size:10pt";
            >
            ${bodyHTML}
          </div>
        </body>
      </html>`;

      return completeHTML;
    } catch (error) {
      const errorBody = `<h4 style="color: red;">${error}</h4>`;
      if (error.location) {
        return `${errorBody} at line ${error.location.start.line}`;
      } else {
        return errorBody;
      }
    }
  };

  const exportPdf = () => {
    const iframeDocument = iframeRef.current.contentDocument;
    const headingElements = iframeDocument.querySelectorAll(
      "h1, h2, h3, h4, h5, h6"
    );
    const divInBody = iframeDocument.querySelector(".main");

    const opt = {
      margin: [1.5, 2],
      filename: "latex_output.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "cm",
        orientation: "portrait",
        format: size,
      },
      pagebreak: { mode: "avoid-all" },
    };

    headingElements.forEach((heading) => {
      heading.style.fontWeight = "700"; // Set the desired font weight
    });

    // Temporarily remove padding from iframe's body
    const originalPadding = divInBody.style.padding;
    divInBody.style.padding = "0";

    const iframeHtml = iframeDocument.documentElement.innerHTML;

    const iframeContainer = document.createElement("div");
    iframeContainer.innerHTML = iframeHtml;

    // Restore original padding for iframe's body
    divInBody.style.padding = originalPadding;

    // Adjust content width to fit within the page boundaries
    const contentContainer = iframeContainer.querySelector(".main");
    contentContainer.style.width = "100%";

    html2pdf().set(opt).from(iframeContainer).save();
  };

  return (
    <div className="h-screen bg-violet-50">
      <div className="flex justify-end bg-[#673AB7] p-2 h-12">
        <div>
          <RenderIf isTrue={previewMode}>
            <Menu as="div" className="relative inline-block text-right">
              <div>
                <Menu.Button className="bg-transparent hover:bg-white hover:text-violet-900 text-violet-50 px-4 py-2 rounded mr-2 focus:outline-none">
                  <RiFilePaper2Fill />
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
                <Menu.Items className="absolute left-0 mt-2  origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => {
                            resize(ESize.letter);
                            setSize(EPaper.letter);
                          }}
                        >
                          Letter
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
                            resize(ESize.tabloid);
                            setSize(EPaper.tabloid);
                          }}
                        >
                          Tabloid
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
                            resize(ESize.A4);
                            setSize(EPaper.A4);
                          }}
                        >
                          A4
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
                            resize(ESize.A5);
                            setSize(EPaper.A5);
                          }}
                        >
                          A5
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </RenderIf>
          <button
            className="bg-transparent hover:bg-white hover:text-violet-900 text-violet-50 px-4 py-2 rounded mr-2 focus:outline-none"
            onClick={() => exportPdf(size)}
          >
            <HiDownload />
          </button>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        className="output-frame w-full h-full border-0"
        title="Output"
        srcDoc={finalHTML(outputContent)}
      ></iframe>
    </div>
  );
};

export default Output;
